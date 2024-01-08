import type { NextPage } from 'next';
import Button from '@components/button';
import Input from '@components/input';
import Layout from '@components/layout';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import useUser from '@libs/client/useUser';

interface EditProfileForm {
  email?: string;
  phone?: string;
  formErrors?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<EditProfileForm>();
  const onValid = (form: EditProfileForm) => {
    if (form.email == '' && form.phone == '') { setError('formErrors', { message: 'Email or Phone number are required. You need to Choose one.' }) }
  }

  useEffect(() => {
    if (user?.email) { setValue('email', user.email) }
    if (user?.phone) { setValue('phone', user.phone) }
  }, [user, setValue])

  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input register={register('email')} required={false} label="Email address" name="email" type="email" />
        <Input register={register('phone')}
          required={false}
          label="Phone number"
          name="phone"
          type="text"
          kind="phone"
        />
        {errors.formErrors ? <p className=' my-2 text-red-500 font-medium'>{errors.formErrors.message}</p> : null}
        <Button text="Update profile" />
      </form>
    </Layout>
  );
};

export default EditProfile;
