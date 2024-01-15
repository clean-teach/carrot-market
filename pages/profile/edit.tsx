import type { NextPage } from 'next';
import Button from '@components/button';
import Input from '@components/input';
import Layout from '@components/layout';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useUser from '@libs/client/useUser';
import useMutation from '@libs/client/useMutation';
import { useRouter } from 'next/router';

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  avatar?: FileList;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const router = useRouter()
  const { user } = useUser();
  const [avatarPreview, setAvatarPreview] = useState('');
  const { register, handleSubmit, setValue, setError, formState: { errors }, clearErrors, watch, resetField } = useForm<EditProfileForm>();
  const avatar = watch('avatar');
  const [editProfile, { data, loading }] = useMutation<EditProfileResponse>('/api/users/me');

  const onChange = () => {
    if (errors.formErrors?.message) {
      clearErrors('formErrors');
    }
  };
  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;
    if (email == '' && phone == '' && name == '') {
      return setError('formErrors', { message: 'Email or Phone number are required. You need to Choose one.' })
    }
    if (avatar && avatar.length > 0 && user) {
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      const form = new FormData();

      form.append("file", avatar[0], user?.id + "");

      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();

      editProfile({
        email,
        phone,
        name,
        avatarId: id
      });
    } else {
      editProfile({ email, phone, name });
    }
  }

  useEffect(() => {
    if (user?.name) { setValue('name', user.name) }
    if (user?.email) { setValue('email', user.email) }
    if (user?.phone) { setValue('phone', user.phone) }
    if (user?.avatar) { setAvatarPreview(`https://imagedelivery.net/aSbksvJjax-AUC7qVnaC4A/${user?.avatar}/public`) }
  }, [user, setValue])

  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError('formErrors', { message: data.error })
    }
  }, [data, setError])

  useEffect(() => {
    if (data?.ok === true) {
      router.push(`/profile`);
    }
  }, [data, router]);

  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file))
    } else {
      setAvatarPreview('')
    }
  }, [avatar])

  return (
    <Layout canGoBack title="Edit Profile">
      <form onChange={onChange} onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? <img src={avatarPreview} className="w-14 h-14 rounded-full bg-slate-500" /> :
            <div className="w-14 h-14 rounded-full bg-slate-500" />}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register('avatar')}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
          <button
            type='button'
            onClick={() => resetField('avatar')}
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Cancel
          </button>
        </div>
        <Input register={register('name')} required={false} label="Name" name="name" type="text" />
        <Input register={register('email')} required={false} label="Email address" name="email" type="email" />
        <Input register={register('phone')}
          required={false}
          label="Phone number"
          name="phone"
          type="text"
          kind="phone"
        />
        {errors.formErrors ? <p className=' my-2 text-red-500 font-medium'>{errors.formErrors.message}</p> : null}
        <Button text={loading ? 'Loading...' : "Update profile"} />
      </form>
    </Layout>
  );
};

export default EditProfile;
