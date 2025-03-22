import { Link, useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import AuthenticationCard from '@/Components/AuthenticationCard';
import { Checkbox, TextInput, Button } from '@mantine/core';

type FormProps = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms: boolean;
};

export default function Register() {
  const page = useTypedPage();
  const route = useRoute();
  const form = useForm<FormProps>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('register'), {
      onFinish: () => form.reset('password', 'password_confirmation'),
    });
  }

  return (
    <AuthenticationCard>
      <Head title="Register" />

      <form onSubmit={onSubmit}>
        <div>
          <TextInput
            id="name"
            type="text"
            label="Name"
            error={form.errors.name}
            className="mt-1 block w-full"
            value={form.data.name}
            onChange={e => form.setData('name', e.currentTarget.value)}
            required
            autoFocus
            autoComplete="name"
          />
        </div>

        <div className="mt-4">
          <TextInput
            id="email"
            type="email"
            label="Email"
            error={form.errors.email}
            className="mt-1 block w-full"
            value={form.data.email}
            onChange={e => form.setData('email', e.currentTarget.value)}
            required
          />
        </div>

        <div className="mt-4">
          <TextInput
            id="password"
            type="password"
            label="Password"
            error={form.errors.password}
            className="mt-1 block w-full"
            value={form.data.password}
            onChange={e => form.setData('password', e.currentTarget.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="mt-4">
          <TextInput
            id="password_confirmation"
            type="password"
            label="Confirm Password"
            error={form.errors.password_confirmation}
            className="mt-1 block w-full"
            value={form.data.password_confirmation}
            onChange={e =>
              form.setData('password_confirmation', e.currentTarget.value)
            }
            required
            autoComplete="new-password"
          />
        </div>

        {page.props.jetstream.hasTermsAndPrivacyPolicyFeature && (
          <div className="mt-4">
            <div className="flex items-center">
              <Checkbox
                name="terms"
                id="terms"
                error={form.errors.terms}
                label={
                  <div className="ml-2">
                    I agree to the
                    <a
                      target="_blank"
                      href={route('terms.show')}
                      className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                      Terms of Service
                    </a>
                    and
                    <a
                      target="_blank"
                      href={route('policy.show')}
                      className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                      Privacy Policy
                    </a>
                  </div>
                }
                checked={form.data.terms}
                onChange={e => form.setData('terms', e.currentTarget.checked)}
                required
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end mt-4">
          <Link
            href={route('login')}
            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Already registered?
          </Link>

          <Button
            type="submit"
            className={classNames('ml-4', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Register
          </Button>
        </div>
      </form>
    </AuthenticationCard>
  );
}
