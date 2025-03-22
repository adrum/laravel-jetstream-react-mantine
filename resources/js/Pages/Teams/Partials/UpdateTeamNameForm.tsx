import useRoute from '@/Hooks/useRoute';
import ActionMessage from '@/Components/ActionMessage';
import FormSection from '@/Components/FormSection';
import { JetstreamTeamPermissions, Team, User } from '@/types';
import { useForm } from '@inertiajs/react';
import { Button, InputLabel, TextInput } from '@mantine/core';
import classNames from 'classnames';
import React from 'react';

interface Props {
  team: Team & { owner: User };
  permissions: JetstreamTeamPermissions;
}

export default function UpdateTeamNameForm({ team, permissions }: Props) {
  const route = useRoute();
  const form = useForm({
    name: team.name,
  });

  function updateTeamName() {
    form.put(route('teams.update', [team]), {
      errorBag: 'updateTeamName',
      preserveScroll: true,
    });
  }

  return (
    <FormSection
      onSubmit={updateTeamName}
      title={'Team Name'}
      description={`The team's name and owner information.`}
      renderActions={
        permissions.canUpdateTeam
          ? () => (
              <>
                <ActionMessage on={form.recentlySuccessful} className="mr-3">
                  Saved.
                </ActionMessage>

                <Button
                  type="submit"
                  className={classNames({ 'opacity-25': form.processing })}
                  disabled={form.processing}
                >
                  Save
                </Button>
              </>
            )
          : undefined
      }
    >
      {/* <!-- Team Owner Information --> */}
      <div className="col-span-6">
        <InputLabel>Team Owner</InputLabel>

        <div className="flex items-center mt-2">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={team.owner.profile_photo_url}
            alt={team.owner.name}
          />

          <div className="ml-4 leading-tight">
            <div className="text-gray-900 dark:text-white">
              {team.owner.name}
            </div>
            <div className="text-gray-700 dark:text-gray-300 text-sm">
              {team.owner.email}
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Team Name --> */}
      <div className="col-span-6 sm:col-span-4">
        <TextInput
          id="name"
          type="text"
          label="Team Name"
          error={form.errors.name}
          className="mt-1 block w-full"
          value={form.data.name}
          onChange={e => form.setData('name', e.currentTarget.value)}
          disabled={!permissions.canUpdateTeam}
        />
      </div>
    </FormSection>
  );
}
