import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import ActionMessage from '@/Components/ActionMessage';
import ActionSection from '@/Components/ActionSection';
import ConfirmationModal from '@/Components/ConfirmationModal';
import DialogModal from '@/Components/DialogModal';
import FormSection from '@/Components/FormSection';
import { Button, InputError, InputLabel, TextInput } from '@mantine/core';
import SectionBorder from '@/Components/SectionBorder';
import {
  JetstreamTeamPermissions,
  Nullable,
  Role,
  Team,
  TeamInvitation,
  User,
} from '@/types';
import { router } from '@inertiajs/core';
import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useState } from 'react';

interface UserMembership extends User {
  membership: {
    role: string;
  };
}

interface Props {
  team: Team & {
    team_invitations: TeamInvitation[];
    users: UserMembership[];
  };
  availableRoles: Role[];
  userPermissions: JetstreamTeamPermissions;
}

export default function TeamMemberManager({
  team,
  availableRoles,
  userPermissions,
}: Props) {
  const route = useRoute();
  const addTeamMemberForm = useForm({
    email: '',
    role: null as Nullable<string>,
  });
  const updateRoleForm = useForm({
    role: null as Nullable<string>,
  });
  const leaveTeamForm = useForm({});
  const removeTeamMemberForm = useForm({});
  const [currentlyManagingRole, setCurrentlyManagingRole] = useState(false);
  const [managingRoleFor, setManagingRoleFor] = useState<Nullable<User>>(null);
  const [confirmingLeavingTeam, setConfirmingLeavingTeam] = useState(false);
  const [teamMemberBeingRemoved, setTeamMemberBeingRemoved] =
    useState<Nullable<User>>(null);
  const page = useTypedPage();

  function addTeamMember() {
    addTeamMemberForm.post(route('team-members.store', [team]), {
      errorBag: 'addTeamMember',
      preserveScroll: true,
      onSuccess: () => addTeamMemberForm.reset(),
    });
  }

  function cancelTeamInvitation(invitation: TeamInvitation) {
    router.delete(route('team-invitations.destroy', [invitation]), {
      preserveScroll: true,
    });
  }

  function manageRole(teamMember: UserMembership) {
    setManagingRoleFor(teamMember);
    updateRoleForm.setData('role', teamMember.membership.role);
    setCurrentlyManagingRole(true);
  }

  function updateRole() {
    if (!managingRoleFor) {
      return;
    }
    updateRoleForm.put(route('team-members.update', [team, managingRoleFor]), {
      preserveScroll: true,
      onSuccess: () => setCurrentlyManagingRole(false),
    });
  }

  function confirmLeavingTeam() {
    setConfirmingLeavingTeam(true);
  }

  function leaveTeam() {
    leaveTeamForm.delete(
      route('team-members.destroy', [team, page.props.auth.user!]),
    );
  }

  function confirmTeamMemberRemoval(teamMember: User) {
    setTeamMemberBeingRemoved(teamMember);
  }

  function removeTeamMember() {
    if (!teamMemberBeingRemoved) {
      return;
    }
    removeTeamMemberForm.delete(
      route('team-members.destroy', [team, teamMemberBeingRemoved]),
      {
        errorBag: 'removeTeamMember',
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => setTeamMemberBeingRemoved(null),
      },
    );
  }

  function displayableRole(role: string) {
    return availableRoles.find(r => r.key === role)?.name;
  }

  return (
    <div>
      {userPermissions.canAddTeamMembers ? (
        <div>
          <SectionBorder />

          {/* <!-- Add Team Member --> */}
          <FormSection
            onSubmit={addTeamMember}
            title={'Add Team Member'}
            description={
              'Add a new team member to your team, allowing them to collaborate with you.'
            }
            renderActions={() => (
              <>
                <ActionMessage
                  on={addTeamMemberForm.recentlySuccessful}
                  className="mr-3"
                >
                  Added.
                </ActionMessage>

                <Button
                  type="submit"
                  className={classNames({
                    'opacity-25': addTeamMemberForm.processing,
                  })}
                  disabled={addTeamMemberForm.processing}
                >
                  Add
                </Button>
              </>
            )}
          >
            <div className="col-span-6">
              <div className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
                Please provide the email address of the person you would like to
                add to this team.
              </div>
            </div>

            {/* <!-- Member Email --> */}
            <div className="col-span-6 sm:col-span-4">
              <TextInput
                id="email"
                type="email"
                label="Email"
                error={addTeamMemberForm.errors.email}
                className="mt-1 block w-full"
                value={addTeamMemberForm.data.email}
                onChange={e =>
                  addTeamMemberForm.setData('email', e.currentTarget.value)
                }
              />
            </div>

            {/* <!-- Role --> */}
            {availableRoles.length > 0 ? (
              <div className="col-span-6 lg:col-span-4">
                <InputLabel htmlFor="roles">Role</InputLabel>
                <InputError className="mt-2">
                  {addTeamMemberForm.errors.role}
                </InputError>

                <div className="relative z-0 mt-1 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer">
                  {availableRoles.map((role, i) => (
                    <Button
                      type="button"
                      unstyled
                      className={classNames(
                        'relative px-4 py-3 inline-flex w-full rounded-lg focus:z-10 focus:outline-hidden focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600',
                        {
                          'border-t border-gray-200 dark:border-gray-700 focus:border-none rounded-t-none':
                            i > 0,
                          'rounded-b-none':
                            i != Object.keys(availableRoles).length - 1,
                        },
                      )}
                      onClick={() =>
                        addTeamMemberForm.setData('role', role.key)
                      }
                      key={role.key}
                    >
                      <div
                        className={classNames({
                          'opacity-50':
                            addTeamMemberForm.data.role &&
                            addTeamMemberForm.data.role != role.key,
                        })}
                      >
                        {/* <!-- Role Name --> */}
                        <div className="flex items-center">
                          <div
                            className={classNames(
                              'text-sm text-gray-600 dark:text-gray-400',
                              {
                                'font-semibold':
                                  addTeamMemberForm.data.role == role.key,
                              },
                            )}
                          >
                            {role.name}
                          </div>

                          {addTeamMemberForm.data.role == role.key ? (
                            <svg
                              className="ml-2 h-5 w-5 text-green-400"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          ) : null}
                        </div>

                        {/* <!-- Role Description --> */}
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                          {role.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
          </FormSection>
        </div>
      ) : null}

      {team.team_invitations.length > 0 && userPermissions.canAddTeamMembers ? (
        <div>
          <SectionBorder />

          {/* <!-- Team Member Invitations --> */}
          <div className="mt-10 sm:mt-0" />

          <ActionSection
            title={'Pending Team Invitations'}
            description={
              'These people have been invited to your team and have been sent an invitation email. They may join the team by accepting the email invitation.'
            }
          >
            {/* <!-- Pending Team Member Invitation List --> */}
            <div className="space-y-6">
              {team.team_invitations.map(invitation => (
                <div
                  className="flex items-center justify-between"
                  key={invitation.id}
                >
                  <div className="text-gray-600 dark:text-gray-400">
                    {invitation.email}
                  </div>

                  <div className="flex items-center">
                    {/* <!-- Cancel Team Invitation --> */}
                    {userPermissions.canRemoveTeamMembers ? (
                      <Button
                        variant="subtle"
                        size="sm"
                        color="red"
                        className="ml-6"
                        onClick={() => cancelTeamInvitation(invitation)}
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </ActionSection>
        </div>
      ) : null}

      {team.users.length > 0 ? (
        <div>
          <SectionBorder />

          {/* <!-- Manage Team Members --> */}
          <div className="mt-10 sm:mt-0" />

          <ActionSection
            title={'Team Members'}
            description={'All of the people that are part of this team.'}
          >
            {/* <!-- Team Member List --> */}
            <div className="space-y-6">
              {team.users.map(user => (
                <div
                  className="flex items-center justify-between"
                  key={user.id}
                >
                  <div className="flex items-center">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={user.profile_photo_url}
                      alt={user.name}
                    />
                    <div className="ml-4 dark:text-white">{user.name}</div>
                  </div>

                  <div className="flex items-center">
                    {/* <!-- Manage Team Member Role --> */}
                    {userPermissions.canAddTeamMembers &&
                    availableRoles.length ? (
                      <Button
                        size="sm"
                        color="gray"
                        variant="subtle"
                        className="ml-2"
                        onClick={() => manageRole(user)}
                      >
                        <span className="underline">
                          {displayableRole(user.membership.role)}
                        </span>
                      </Button>
                    ) : availableRoles.length ? (
                      <div className="ml-2 text-sm text-gray-400">
                        {displayableRole(user.membership.role)}
                      </div>
                    ) : null}

                    {/* <!-- Leave Team --> */}
                    {page.props.auth.user?.id === user.id ? (
                      <Button
                        color="red"
                        variant="subtle"
                        size="sm"
                        className="ml-6"
                        onClick={confirmLeavingTeam}
                      >
                        Leave
                      </Button>
                    ) : null}

                    {/* <!-- Remove Team Member --> */}
                    {userPermissions.canRemoveTeamMembers ? (
                      <Button
                        color="red"
                        variant="subtle"
                        size="sm"
                        className="ml-2"
                        onClick={() => confirmTeamMemberRemoval(user)}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </ActionSection>
        </div>
      ) : null}

      {/* <!-- Role Management Modal --> */}
      <DialogModal
        opened={currentlyManagingRole}
        title={'Manage Role'}
        onClose={() => setCurrentlyManagingRole(false)}
      >
        <DialogModal.Content></DialogModal.Content>
        {managingRoleFor ? (
          <div>
            <div className="relative z-0 mt-1 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer">
              {availableRoles.map((role, i) => (
                <Button
                  unstyled
                  type="button"
                  className={classNames(
                    'relative px-4 py-3 inline-flex w-full rounded-lg focus:z-10 focus:outline-hidden focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600',
                    {
                      'border-t border-gray-200 dark:border-gray-700 focus:border-none rounded-t-none':
                        i > 0,
                      'rounded-b-none':
                        i !== Object.keys(availableRoles).length - 1,
                    },
                  )}
                  onClick={() => updateRoleForm.setData('role', role.key)}
                  key={role.key}
                >
                  <div
                    className={classNames({
                      'opacity-50':
                        updateRoleForm.data.role &&
                        updateRoleForm.data.role !== role.key,
                    })}
                  >
                    {/* <!-- Role Name --> */}
                    <div className="flex items-center">
                      <div
                        className={classNames(
                          'text-sm text-gray-600 dark:text-gray-400',
                          {
                            'font-semibold':
                              updateRoleForm.data.role === role.key,
                          },
                        )}
                      >
                        {role.name}
                      </div>
                      {updateRoleForm.data.role === role.key ? (
                        <svg
                          className="ml-2 h-5 w-5 text-green-400"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      ) : null}
                    </div>

                    {/* <!-- Role Description --> */}
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      {role.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ) : null}
        <DialogModal.Footer>
          <Button
            variant="outline"
            onClick={() => setCurrentlyManagingRole(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={updateRole}
            className={classNames('ml-2', {
              'opacity-25': updateRoleForm.processing,
            })}
            disabled={updateRoleForm.processing}
          >
            Save
          </Button>
        </DialogModal.Footer>
      </DialogModal>

      {/* <!-- Leave Team Confirmation Modal --> */}
      <ConfirmationModal
        opened={confirmingLeavingTeam}
        onClose={() => setConfirmingLeavingTeam(false)}
      >
        <ConfirmationModal.Content title={'Leave Team'}>
          Are you sure you would like to leave this team?
        </ConfirmationModal.Content>
        <ConfirmationModal.Footer>
          <Button
            variant="outline"
            onClick={() => setConfirmingLeavingTeam(false)}
          >
            Cancel
          </Button>

          <Button
            color="red"
            onClick={leaveTeam}
            className={classNames('ml-2', {
              'opacity-25': leaveTeamForm.processing,
            })}
            disabled={leaveTeamForm.processing}
          >
            Leave
          </Button>
        </ConfirmationModal.Footer>
      </ConfirmationModal>

      {/* <!-- Remove Team Member Confirmation Modal --> */}
      <ConfirmationModal
        opened={!!teamMemberBeingRemoved}
        onClose={() => setTeamMemberBeingRemoved(null)}
      >
        <ConfirmationModal.Content title={'Remove Team Member'}>
          Are you sure you would like to remove this person from the team?
        </ConfirmationModal.Content>
        <ConfirmationModal.Footer>
          <Button
            variant="outline"
            onClick={() => setTeamMemberBeingRemoved(null)}
          >
            Cancel
          </Button>

          <Button
            color="red"
            onClick={removeTeamMember}
            className={classNames('ml-2', {
              'opacity-25': removeTeamMemberForm.processing,
            })}
            disabled={removeTeamMemberForm.processing}
          >
            Remove
          </Button>
        </ConfirmationModal.Footer>
      </ConfirmationModal>
    </div>
  );
}
