/* eslint-disable no-param-reassign, array-callback-return, import/no-cycle, max-len, no-restricted-syntax, consistent-return */

import { AxiosResponse } from 'axios';
import ApiService from '@api/ApiService';
import createUserJSON from '@api/body/userManagement/createUser.json';
import resetPasswordJSON from '@api/body/userManagement/resetPassword.json';
import addRolesToUserJSON from '@api/body/userManagement/addRolesToUser.json';
import createPasswordCriteriaJSON from '@api/body/userManagement/createPasswordCriteria.json';
import updatePasswordCriteriaJSON from '@api/body/userManagement/editPasswordCriteria.json';
import createGroupJSON from '@api/body/userManagement/createGroup.json';
import addUsersToGroupJSON from '@api/body/userManagement/addUsersToGroup.json';
import updateGroupJSON from '@api/body/userManagement/updateGroup.json';
import createRoleJSON from '@api/body/userManagement/createrRole.json';
import updateRoleJSON from '@api/body/userManagement/updateRole.json';
import createPermissionJSON from '@api/body/userManagement/createPermission.json';
import addPermissionsToRoleJSON from '@api/body/userManagement/addPermissionsToRole.json';
import addTemporalRolesToUser from '@api/body/userManagement/addTemporalRolesToUser.json';
import permissionTransferJSON from '@api/body/userManagement/transferUserPermission.json';

class UserManagementService {
    public async createUser(userName: string, userPassword: string) {
        const body = JSON.parse(JSON.stringify(createUserJSON));
        body.username = userName;
        body.password = userPassword;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/infra-authn/rest/users', body);
        return response.status;
    }

    public async checkUsers(userName: string) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get('/infra-authn/rest/users');
        const user = response.data.find((element:any) => element.username === userName);
        return user;
    }

    public async updateUser(userName: string, updatedName: string) {
        const user = await this.checkUsers(userName);
        user.name = updatedName;
        const response: AxiosResponse = await ApiService.getInstance().instance.put('/infra-authn/rest/users', user);
        return response.status;
    }

    public async resetUserPassword(userName: string, newPassword: string) {
        const body = JSON.parse(JSON.stringify(resetPasswordJSON));
        body.username = userName;
        body.newPassword = newPassword;
        const response: AxiosResponse = await ApiService.getInstance().instance.put('/infra-authn/rest/users/passwords', body);
        return response.status;
    }

    public async deleteUser(userName: string) {
        const user = await this.checkUsers(userName);
        const response: AxiosResponse = await ApiService.getInstance().instance.delete(`/infra-authn/rest/users/${user.id}`);
        return response.status;
    }

    public async addRolesToUser(userName: string, roleName: string) {
        const body = JSON.parse(JSON.stringify(addRolesToUserJSON));
        const user = await this.checkUsers(userName);
        body.rolesToAdd[0].name = roleName;
        const response: AxiosResponse = await ApiService.getInstance().instance.patch(`/infra-authz/rest/users/${user.id}/roles`, body);
        return response.status;
    }

    public async addTemporalRolesToUser(userName: string, roleName: string) {
        const body = JSON.parse(JSON.stringify(addTemporalRolesToUser));
        const user = await this.checkUsers(userName);
        const role = await this.checkRoles(roleName);
        body.userId = user.id;
        body.roleIds[0] = role.id;
        const currentDate: Date = new Date();
        const epochTime: number = Math.floor(currentDate.getTime() / 1000);
        const startTime = (epochTime + 10) * 1000;
        const endTime = (epochTime + 86400) * 1000;
        body.start = startTime;
        body.end = endTime;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/infra-authz/rest/role-delegations', body);
        return response.status;
    }

    public async createPasswordCriteria(passwordName: string, minLength: number, maxLength: number) {
        const body = JSON.parse(JSON.stringify(createPasswordCriteriaJSON));
        body.name = passwordName;
        body.minLength = minLength;
        body.maxLength = maxLength;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/infra-authn/rest/users/password-criteria', body);
        return response.status;
    }

    public async checkPasswordCriteria(passwordName: string) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get('/infra-authn/rest/users/password-criteria');
        const passwordCriteria = response.data.find((element:any) => element.name === passwordName);
        return passwordCriteria;
    }

    public async updatePasswordCriteria(passwordName: string, updatedPasswordName: string) {
        const body = JSON.parse(JSON.stringify(updatePasswordCriteriaJSON));
        body.name = updatedPasswordName;
        const previousPasswordCriteria = await this.checkPasswordCriteria(passwordName);
        body.id = previousPasswordCriteria.id;
        const response: AxiosResponse = await ApiService.getInstance().instance.put('/infra-authn/rest/users/password-criteria', body);
        return response.status;
    }

    public async activatePasswordCriteria(passwordName: string) {
        const previousPasswordCriteria = await this.checkPasswordCriteria(passwordName);
        const response: AxiosResponse = await ApiService.getInstance().instance.put(`/infra-authn/rest/users/password-criteria/active?id=${previousPasswordCriteria.id}`);
        return response.status;
    }

    public async deactivatePasswordCriteria(passwordName: string) {
        const previousPasswordCriteria = await this.checkPasswordCriteria(passwordName);
        const response: AxiosResponse = await ApiService.getInstance().instance.put(`/infra-authn/rest/users/password-criteria/passive?id=${previousPasswordCriteria.id}`);
        return response.status;
    }

    public async deletePasswordCriteria(passwordName: string) {
        const previousPasswordCriteria = await this.checkPasswordCriteria(passwordName);
        const response: AxiosResponse = await ApiService.getInstance().instance.delete(`/infra-authn/rest/users/password-criteria/${previousPasswordCriteria.id}`);
        return response.status;
    }

    public async createGroup(groupName: string, groupDescription: string) {
        const body = JSON.parse(JSON.stringify(createGroupJSON));
        body.name = groupName;
        body.description = groupDescription;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/infra-authz/rest/groups', body);
        return response.status;
    }

    public async checkGroups(groupName) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get('/infra-authz/rest/groups');
        const group = response.data.find((element:any) => element.name === groupName);
        return group;
    }

    public async addUsersToGroup(groupName: string, userName: string) {
        const body = JSON.parse(JSON.stringify(addUsersToGroupJSON));
        const group = await this.checkGroups(groupName);
        const user = await this.checkUsers(userName);
        body.usersToAdd[0] = user;
        const response: AxiosResponse = await ApiService.getInstance().instance.patch(`/infra-authz/rest/groups/${group.id}/users`, body);
        return response.status;
    }

    public async updateGroup(groupName: string, updatedGroupName: string, updatedGroupDescription: string) {
        const body = JSON.parse(JSON.stringify(updateGroupJSON));
        body.name = updatedGroupName;
        body.description = updatedGroupDescription;
        const previousGroup = await this.checkGroups(groupName);
        body.id = previousGroup.id;
        const response: AxiosResponse = await ApiService.getInstance().instance.put('/infra-authz/rest/groups', body);
        return response.status;
    }

    public async deleteGroup(groupName: string) {
        const previousGroup = await this.checkGroups(groupName);
        const response: AxiosResponse = await ApiService.getInstance().instance.delete(`/infra-authz/rest/groups/${previousGroup.id}`);
        return response.status;
    }

    public async createRole(roleName: string, roleDescription: string) {
        const body = JSON.parse(JSON.stringify(createRoleJSON));
        body.name = roleName;
        body.description = roleDescription;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/infra-authz/rest/roles', body);
        return response.status;
    }

    public async checkRoles(roleName = 'all') {
        const response: AxiosResponse = await ApiService.getInstance().instance.get('/infra-authz/rest/roles');
        const role = response.data.find((element:any) => element.name === roleName);
        return role;
    }

    public async updateRole(roleName:string, updatedRoleName:string, updatedRoleDescription:string) {
        const body = JSON.parse(JSON.stringify(updateRoleJSON));
        body.name = updatedRoleName;
        body.description = updatedRoleDescription;
        const previousRole = await this.checkRoles(roleName);
        body.id = previousRole.id;
        const response: AxiosResponse = await ApiService.getInstance().instance.put('/infra-authz/rest/roles', body);
        return response.status;
    }

    public async addPermissionsToRole(roleName: string, permissionName: string) {
        const body = JSON.parse(JSON.stringify(addPermissionsToRoleJSON));
        const previousRole = await this.checkRoles(roleName);
        const getPermission = await this.checkPermissions(permissionName);
        body.permissionsToAdd[0] = getPermission;
        const response: AxiosResponse = await ApiService.getInstance().instance.patch(`/infra-authz/rest/roles/${previousRole.id}/permissions`, body);
        return response.status;
    }

    public async transferPermission(sourceUsername: string, targetUsername: string) {
        const body = JSON.parse(JSON.stringify(permissionTransferJSON));
        const sourceUser = await this.checkUsers(sourceUsername);
        const targetUser = await this.checkUsers(targetUsername);
        const currentDate: Date = new Date();
        const epochTime: number = Math.floor(currentDate.getTime() / 1000);
        const startTime = (epochTime + 10) * 1000;
        const endTime = (epochTime + 86400) * 1000;
        body.start = startTime;
        body.end = endTime;
        body.sourceUserId = sourceUser.id;
        body.targetUserId = targetUser.id;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/infra-authz/rest/user-delegations', body);
        return response.status;
    }

    public async deleteRole(roleName: string) {
        const previousRole = await this.checkRoles(roleName);
        const response: AxiosResponse = await ApiService.getInstance().instance.delete(`/infra-authz/rest/roles/${previousRole.id}`);
        return response.status;
    }

    public async createPermission(permissionName: string, permissionDescription: string) {
        const body = JSON.parse(JSON.stringify(createPermissionJSON));
        body.name = permissionName;
        body.description = permissionDescription;
        const response: AxiosResponse = await ApiService.getInstance().instance.post('/infra-authz/rest/permissions', body);
        return response.status;
    }

    public async checkPermissions(permissionName: string) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get('/infra-authz/rest/permissions');
        const permission = response.data.find((element:any) => element.name === permissionName);
        return permission;
    }

    public async updatePermission(permissionName: string, updatedPermissionName: string) {
        const previousPermission = await this.checkPermissions(permissionName);
        previousPermission.name = updatedPermissionName;
        const response: AxiosResponse = await ApiService.getInstance().instance.put('/infra-authz/rest/permissions', previousPermission);
        return response.status;
    }

    public async deletePermission(permissionName: string) {
        const previousPermission = await this.checkPermissions(permissionName);
        const response: AxiosResponse = await ApiService.getInstance().instance.delete(`/infra-authz/rest/permissions/${previousPermission.id}`);
        return response.status;
    }
}
export const userManagementService = new UserManagementService();
