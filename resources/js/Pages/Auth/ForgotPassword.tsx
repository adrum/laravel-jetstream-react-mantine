import { useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import AuthenticationCard from '@/Components/AuthenticationCard';
import { Button, TextInput } from '@mantine/core';

interface Props {
  status: string;
}

export default function ForgotPassword({ status }: Props) {
  const route = useRoute();
  const form = useForm({
    email: '',
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('password.email'));
  }

  return (
    <AuthenticationCard>
      <Head title="Forgot Password" />

      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Forgot your password? No problem. Just let us know your email address
        and we will email you a password reset link that will allow you to
        choose a new one.
      </div>

      {status && (
        <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
          {status}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div>
          <TextInput
            id="email"
            type="email"
            label="Email"
            error={form.errors.email}
            className="mt-1 block w-full"
            value={form.data.email}
            onChange={e => form.setData('email', e.currentTarget.value)}
            required
            autoFocus
          />
        </div>

        <div className="flex items-center justify-end mt-4">
          <Button
            type="submit"
            className={classNames({ 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Email Password Reset Link
          </Button>
        </div>
      </form>
    </AuthenticationCard>
  );
}
