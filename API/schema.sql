Build started...
Build succeeded.
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [AspNetRoles] (
    [Id] uniqueidentifier NOT NULL,
    [Default] bit NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] uniqueidentifier NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] uniqueidentifier NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey])
);
GO

CREATE TABLE [AspNetUserRoles] (
    [UserId] uniqueidentifier NOT NULL,
    [RoleId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUsers] (
    [Id] uniqueidentifier NOT NULL,
    [InvitationKey] uniqueidentifier NULL,
    [FirstName] nvarchar(max) NOT NULL,
    [LastName] nvarchar(max) NOT NULL,
    [DateOfBirth] date NOT NULL,
    [Created] datetime2 NOT NULL,
    [LastSeen] datetime2 NOT NULL,
    [ProfilePicturePath] nvarchar(max) NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AspNetUserTokens] (
    [UserId] uniqueidentifier NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Invitations] (
    [Key] uniqueidentifier NOT NULL,
    [Expires] datetime2 NOT NULL,
    [CreatedById] uniqueidentifier NOT NULL,
    [IsActivated] bit NOT NULL,
    CONSTRAINT [PK_Invitations] PRIMARY KEY ([Key]),
    CONSTRAINT [FK_Invitations_AspNetUsers_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Notifications] (
    [Id] uniqueidentifier NOT NULL,
    [Type] nvarchar(32) NOT NULL,
    [Title] nvarchar(max) NOT NULL,
    [Content] nvarchar(max) NOT NULL,
    [TargetUserId] uniqueidentifier NOT NULL,
    [Created] datetime2 NOT NULL,
    [Viewed] bit NOT NULL,
    CONSTRAINT [PK_Notifications] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Notifications_AspNetUsers_TargetUserId] FOREIGN KEY ([TargetUserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Projects] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [ProjectManagerId] uniqueidentifier NOT NULL,
    [Created] datetime2 NOT NULL,
    CONSTRAINT [PK_Projects] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Projects_AspNetUsers_ProjectManagerId] FOREIGN KEY ([ProjectManagerId]) REFERENCES [AspNetUsers] ([Id])
);
GO

CREATE TABLE [Teams] (
    [Id] uniqueidentifier NOT NULL,
    [ProjectId] uniqueidentifier NOT NULL,
    [TeamLeaderId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_Teams] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Teams_AspNetUsers_TeamLeaderId] FOREIGN KEY ([TeamLeaderId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Teams_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [UserTeams] (
    [UserId] uniqueidentifier NOT NULL,
    [TeamId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_UserTeams] PRIMARY KEY ([TeamId], [UserId]),
    CONSTRAINT [FK_UserTeams_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_UserTeams_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
GO

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;
GO

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
GO

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
GO

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
GO

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
GO

CREATE INDEX [IX_AspNetUsers_InvitationKey] ON [AspNetUsers] ([InvitationKey]);
GO

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;
GO

CREATE INDEX [IX_Invitations_CreatedById] ON [Invitations] ([CreatedById]);
GO

CREATE INDEX [IX_Notifications_TargetUserId] ON [Notifications] ([TargetUserId]);
GO

CREATE INDEX [IX_Projects_ProjectManagerId] ON [Projects] ([ProjectManagerId]);
GO

CREATE INDEX [IX_Teams_ProjectId] ON [Teams] ([ProjectId]);
GO

CREATE INDEX [IX_Teams_TeamLeaderId] ON [Teams] ([TeamLeaderId]);
GO

CREATE INDEX [IX_UserTeams_UserId] ON [UserTeams] ([UserId]);
GO

ALTER TABLE [AspNetUserClaims] ADD CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE;
GO

ALTER TABLE [AspNetUserLogins] ADD CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE;
GO

ALTER TABLE [AspNetUserRoles] ADD CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE;
GO

ALTER TABLE [AspNetUsers] ADD CONSTRAINT [FK_AspNetUsers_Invitations_InvitationKey] FOREIGN KEY ([InvitationKey]) REFERENCES [Invitations] ([Key]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20240624155102_Initial', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Teams] DROP CONSTRAINT [FK_Teams_Projects_ProjectId];
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Teams]') AND [c].[name] = N'ProjectId');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Teams] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [Teams] ALTER COLUMN [ProjectId] uniqueidentifier NULL;
GO

ALTER TABLE [Teams] ADD [Name] nvarchar(max) NOT NULL DEFAULT N'';
GO

CREATE TABLE [TeamLeaderProject] (
    [UserId] uniqueidentifier NOT NULL,
    [ProjectId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_TeamLeaderProject] PRIMARY KEY ([ProjectId], [UserId]),
    CONSTRAINT [FK_TeamLeaderProject_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_TeamLeaderProject_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_TeamLeaderProject_UserId] ON [TeamLeaderProject] ([UserId]);
GO

ALTER TABLE [Teams] ADD CONSTRAINT [FK_Teams_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20240929204114_ProjectTeamleaders', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Teams] DROP CONSTRAINT [FK_Teams_Projects_ProjectId];
GO

DROP INDEX [IX_Teams_ProjectId] ON [Teams];
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Teams]') AND [c].[name] = N'ProjectId');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Teams] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [Teams] DROP COLUMN [ProjectId];
GO

CREATE TABLE [TeamProject] (
    [TeamId] uniqueidentifier NOT NULL,
    [ProjectId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_TeamProject] PRIMARY KEY ([ProjectId], [TeamId]),
    CONSTRAINT [FK_TeamProject_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_TeamProject_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_TeamProject_TeamId] ON [TeamProject] ([TeamId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241004165057_TeamProjects', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [UserTeams] DROP CONSTRAINT [FK_UserTeams_AspNetUsers_UserId];
GO

ALTER TABLE [UserTeams] DROP CONSTRAINT [FK_UserTeams_Teams_TeamId];
GO

ALTER TABLE [UserTeams] DROP CONSTRAINT [PK_UserTeams];
GO

EXEC sp_rename N'[UserTeams]', N'UserTeam';
GO

EXEC sp_rename N'[UserTeam].[IX_UserTeams_UserId]', N'IX_UserTeam_UserId', N'INDEX';
GO

ALTER TABLE [UserTeam] ADD CONSTRAINT [PK_UserTeam] PRIMARY KEY ([TeamId], [UserId]);
GO

CREATE TABLE [Sprints] (
    [Id] uniqueidentifier NOT NULL,
    [Start] date NOT NULL,
    [End] date NOT NULL,
    [ProjectId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_Sprints] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Sprints_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Stories] (
    [Id] uniqueidentifier NOT NULL,
    [Created] datetime2 NOT NULL,
    [Title] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [AssignedToId] uniqueidentifier NULL,
    [StoryPriority] int NOT NULL,
    [StoryType] int NOT NULL,
    [ProjectId] uniqueidentifier NOT NULL,
    [SprintId] uniqueidentifier NULL,
    [StoryPoints] int NOT NULL,
    CONSTRAINT [PK_Stories] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Stories_AspNetUsers_AssignedToId] FOREIGN KEY ([AssignedToId]) REFERENCES [AspNetUsers] ([Id]),
    CONSTRAINT [FK_Stories_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Stories_Sprints_SprintId] FOREIGN KEY ([SprintId]) REFERENCES [Sprints] ([Id])
);
GO

CREATE TABLE [StoryCommit] (
    [Id] uniqueidentifier NOT NULL,
    [Created] datetime2 NOT NULL,
    [CommiterId] uniqueidentifier NOT NULL,
    [StoryId] uniqueidentifier NOT NULL,
    [StoryCommitType] int NOT NULL,
    [Hours] int NOT NULL,
    CONSTRAINT [PK_StoryCommit] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_StoryCommit_AspNetUsers_CommiterId] FOREIGN KEY ([CommiterId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_StoryCommit_Stories_StoryId] FOREIGN KEY ([StoryId]) REFERENCES [Stories] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_Sprints_ProjectId] ON [Sprints] ([ProjectId]);
GO

CREATE INDEX [IX_Stories_AssignedToId] ON [Stories] ([AssignedToId]);
GO

CREATE INDEX [IX_Stories_ProjectId] ON [Stories] ([ProjectId]);
GO

CREATE INDEX [IX_Stories_SprintId] ON [Stories] ([SprintId]);
GO

CREATE INDEX [IX_StoryCommit_CommiterId] ON [StoryCommit] ([CommiterId]);
GO

CREATE INDEX [IX_StoryCommit_StoryId] ON [StoryCommit] ([StoryId]);
GO

ALTER TABLE [UserTeam] ADD CONSTRAINT [FK_UserTeam_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION;
GO

ALTER TABLE [UserTeam] ADD CONSTRAINT [FK_UserTeam_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]) ON DELETE NO ACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241006130656_SprintProjectStories', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Stories] ADD [StoryStatus] int NOT NULL DEFAULT 0;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241006172059_StoryStatus', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [StoryCommit] DROP CONSTRAINT [FK_StoryCommit_AspNetUsers_CommiterId];
GO

ALTER TABLE [StoryCommit] DROP CONSTRAINT [FK_StoryCommit_Stories_StoryId];
GO

ALTER TABLE [StoryCommit] DROP CONSTRAINT [PK_StoryCommit];
GO

EXEC sp_rename N'[StoryCommit]', N'StoryCommits';
GO

EXEC sp_rename N'[StoryCommits].[IX_StoryCommit_StoryId]', N'IX_StoryCommits_StoryId', N'INDEX';
GO

EXEC sp_rename N'[StoryCommits].[IX_StoryCommit_CommiterId]', N'IX_StoryCommits_CommiterId', N'INDEX';
GO

ALTER TABLE [StoryCommits] ADD CONSTRAINT [PK_StoryCommits] PRIMARY KEY ([Id]);
GO

ALTER TABLE [StoryCommits] ADD CONSTRAINT [FK_StoryCommits_AspNetUsers_CommiterId] FOREIGN KEY ([CommiterId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE;
GO

ALTER TABLE [StoryCommits] ADD CONSTRAINT [FK_StoryCommits_Stories_StoryId] FOREIGN KEY ([StoryId]) REFERENCES [Stories] ([Id]) ON DELETE CASCADE;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241006212309_StoryCommits', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE INDEX [IX_Sprints_Start] ON [Sprints] ([Start] DESC);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241009230822_SprintStartDateIndex', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Sprints] ADD [EarlyClose] date NOT NULL DEFAULT '0001-01-01';
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241009234653_SprintEarlyClose', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Sprints]') AND [c].[name] = N'EarlyClose');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Sprints] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [Sprints] ALTER COLUMN [EarlyClose] datetime2 NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241010000326_SprintEarlyCloseAllowNull', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Stories] ADD [Closed] datetime2 NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241012151505_StoryClosed', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [TeamLeaderProject] DROP CONSTRAINT [FK_TeamLeaderProject_AspNetUsers_UserId];
GO

ALTER TABLE [TeamLeaderProject] DROP CONSTRAINT [FK_TeamLeaderProject_Projects_ProjectId];
GO

ALTER TABLE [TeamProject] DROP CONSTRAINT [FK_TeamProject_Projects_ProjectId];
GO

ALTER TABLE [TeamProject] DROP CONSTRAINT [FK_TeamProject_Teams_TeamId];
GO

ALTER TABLE [Teams] DROP CONSTRAINT [FK_Teams_AspNetUsers_TeamLeaderId];
GO

ALTER TABLE [UserTeam] DROP CONSTRAINT [FK_UserTeam_AspNetUsers_UserId];
GO

ALTER TABLE [UserTeam] DROP CONSTRAINT [FK_UserTeam_Teams_TeamId];
GO

ALTER TABLE [UserTeam] DROP CONSTRAINT [PK_UserTeam];
GO

DROP INDEX [IX_UserTeam_UserId] ON [UserTeam];
GO

EXEC sp_rename N'[UserTeam].[UserId]', N'MemberId', N'COLUMN';
GO

ALTER TABLE [UserTeam] ADD CONSTRAINT [PK_UserTeam] PRIMARY KEY ([MemberId], [TeamId]);
GO

CREATE INDEX [IX_UserTeam_TeamId] ON [UserTeam] ([TeamId]);
GO

ALTER TABLE [TeamLeaderProject] ADD CONSTRAINT [FK_TeamLeaderProject_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE;
GO

ALTER TABLE [TeamLeaderProject] ADD CONSTRAINT [FK_TeamLeaderProject_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE;
GO

ALTER TABLE [TeamProject] ADD CONSTRAINT [FK_TeamProject_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE;
GO

ALTER TABLE [TeamProject] ADD CONSTRAINT [FK_TeamProject_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]) ON DELETE CASCADE;
GO

ALTER TABLE [Teams] ADD CONSTRAINT [FK_Teams_AspNetUsers_TeamLeaderId] FOREIGN KEY ([TeamLeaderId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION;
GO

ALTER TABLE [UserTeam] ADD CONSTRAINT [FK_UserTeam_AspNetUsers_MemberId] FOREIGN KEY ([MemberId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE;
GO

ALTER TABLE [UserTeam] ADD CONSTRAINT [FK_UserTeam_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]) ON DELETE CASCADE;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241013002258_CascadeDelete', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Logs] (
    [Id] uniqueidentifier NOT NULL,
    [TimeStamp] datetime2 NOT NULL,
    [UserId] uniqueidentifier NULL,
    [LoggerLevel] int NOT NULL,
    [Source] nvarchar(max) NOT NULL,
    [Message] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Logs] PRIMARY KEY ([Id])
);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241013015247_Log', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var3 sysname;
SELECT @var3 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Stories]') AND [c].[name] = N'StoryPoints');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Stories] DROP CONSTRAINT [' + @var3 + '];');
ALTER TABLE [Stories] ALTER COLUMN [StoryPoints] int NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241015150518_StoryPointsNullable', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var4 sysname;
SELECT @var4 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Sprints]') AND [c].[name] = N'EarlyClose');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [Sprints] DROP CONSTRAINT [' + @var4 + '];');
ALTER TABLE [Sprints] DROP COLUMN [EarlyClose];
GO

DROP INDEX [IX_Sprints_Start] ON [Sprints];
DECLARE @var5 sysname;
SELECT @var5 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Sprints]') AND [c].[name] = N'Start');
IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [Sprints] DROP CONSTRAINT [' + @var5 + '];');
ALTER TABLE [Sprints] ALTER COLUMN [Start] datetime2 NOT NULL;
CREATE INDEX [IX_Sprints_Start] ON [Sprints] ([Start] DESC);
GO

DECLARE @var6 sysname;
SELECT @var6 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Sprints]') AND [c].[name] = N'End');
IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [Sprints] DROP CONSTRAINT [' + @var6 + '];');
ALTER TABLE [Sprints] ALTER COLUMN [End] datetime2 NOT NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241015210835_SprintDates', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [StoryCommits] ADD [Summary] nvarchar(48) NOT NULL DEFAULT N'';
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241016161705_StoryCommitSummary', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Skills] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Skills] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [UserSkills] (
    [UserId] uniqueidentifier NOT NULL,
    [SkillId] uniqueidentifier NOT NULL,
    [SkillLevel] int NOT NULL,
    CONSTRAINT [PK_UserSkills] PRIMARY KEY ([UserId], [SkillId]),
    CONSTRAINT [FK_UserSkills_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserSkills_Skills_SkillId] FOREIGN KEY ([SkillId]) REFERENCES [Skills] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_UserSkills_SkillId] ON [UserSkills] ([SkillId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023084028_UserSkills', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Invitations] DROP CONSTRAINT [FK_Invitations_AspNetUsers_CreatedById];
GO

ALTER TABLE [Stories] DROP CONSTRAINT [FK_Stories_AspNetUsers_AssignedToId];
GO

ALTER TABLE [Invitations] ADD CONSTRAINT [FK_Invitations_AspNetUsers_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION;
GO

ALTER TABLE [Stories] ADD CONSTRAINT [FK_Stories_AspNetUsers_AssignedToId] FOREIGN KEY ([AssignedToId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023172011_ProjectManagerNoAction', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Invitations] DROP CONSTRAINT [FK_Invitations_AspNetUsers_CreatedById];
GO

ALTER TABLE [Stories] DROP CONSTRAINT [FK_Stories_AspNetUsers_AssignedToId];
GO

ALTER TABLE [Teams] DROP CONSTRAINT [FK_Teams_AspNetUsers_TeamLeaderId];
GO

ALTER TABLE [Invitations] ADD CONSTRAINT [FK_Invitations_AspNetUsers_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE;
GO

ALTER TABLE [Stories] ADD CONSTRAINT [FK_Stories_AspNetUsers_AssignedToId] FOREIGN KEY ([AssignedToId]) REFERENCES [AspNetUsers] ([Id]);
GO

ALTER TABLE [Teams] ADD CONSTRAINT [FK_Teams_AspNetUsers_TeamLeaderId] FOREIGN KEY ([TeamLeaderId]) REFERENCES [AspNetUsers] ([Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023173725_DeleteActions', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Stories] DROP CONSTRAINT [FK_Stories_AspNetUsers_AssignedToId];
GO

ALTER TABLE [Stories] ADD CONSTRAINT [FK_Stories_AspNetUsers_AssignedToId] FOREIGN KEY ([AssignedToId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE SET NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023173830_DeleteActions2', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Teams] DROP CONSTRAINT [FK_Teams_AspNetUsers_TeamLeaderId];
GO

ALTER TABLE [UserTeam] DROP CONSTRAINT [FK_UserTeam_AspNetUsers_MemberId];
GO

ALTER TABLE [Teams] ADD CONSTRAINT [FK_Teams_AspNetUsers_TeamLeaderId] FOREIGN KEY ([TeamLeaderId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE;
GO

ALTER TABLE [UserTeam] ADD CONSTRAINT [FK_UserTeam_AspNetUsers_MemberId] FOREIGN KEY ([MemberId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023175843_DeleteActions3', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023180158_DeleteActions4', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023181900_DeleteActions5', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Projects] DROP CONSTRAINT [FK_Projects_AspNetUsers_ProjectManagerId];
GO

DECLARE @var7 sysname;
SELECT @var7 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'ProjectManagerId');
IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var7 + '];');
ALTER TABLE [Projects] ALTER COLUMN [ProjectManagerId] uniqueidentifier NULL;
GO

ALTER TABLE [Projects] ADD CONSTRAINT [FK_Projects_AspNetUsers_ProjectManagerId] FOREIGN KEY ([ProjectManagerId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE SET NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023182444_DeleteActions6', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Projects] DROP CONSTRAINT [FK_Projects_AspNetUsers_ProjectManagerId];
GO

DROP INDEX [IX_Projects_ProjectManagerId] ON [Projects];
DECLARE @var8 sysname;
SELECT @var8 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'ProjectManagerId');
IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var8 + '];');
UPDATE [Projects] SET [ProjectManagerId] = '00000000-0000-0000-0000-000000000000' WHERE [ProjectManagerId] IS NULL;
ALTER TABLE [Projects] ALTER COLUMN [ProjectManagerId] uniqueidentifier NOT NULL;
ALTER TABLE [Projects] ADD DEFAULT '00000000-0000-0000-0000-000000000000' FOR [ProjectManagerId];
CREATE INDEX [IX_Projects_ProjectManagerId] ON [Projects] ([ProjectManagerId]);
GO

ALTER TABLE [Projects] ADD CONSTRAINT [FK_Projects_AspNetUsers_ProjectManagerId] FOREIGN KEY ([ProjectManagerId]) REFERENCES [AspNetUsers] ([Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023183206_DeleteActions7', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [UserTeam] DROP CONSTRAINT [FK_UserTeam_AspNetUsers_MemberId];
GO

ALTER TABLE [UserTeam] ADD CONSTRAINT [FK_UserTeam_AspNetUsers_MemberId] FOREIGN KEY ([MemberId]) REFERENCES [AspNetUsers] ([Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023212127_DeleteActions8', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023212330_DeleteActions9', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [UserTeam] DROP CONSTRAINT [FK_UserTeam_AspNetUsers_MemberId];
GO

ALTER TABLE [UserTeam] ADD CONSTRAINT [FK_UserTeam_AspNetUsers_MemberId] FOREIGN KEY ([MemberId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023212505_DeleteActions10', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var9 sysname;
SELECT @var9 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Skills]') AND [c].[name] = N'Name');
IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [Skills] DROP CONSTRAINT [' + @var9 + '];');
ALTER TABLE [Skills] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

CREATE UNIQUE INDEX [IX_Skills_Name] ON [Skills] ([Name]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241024194157_SkillNameUnique', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [AspNetUsers] ADD [LastViewedProjectId] uniqueidentifier NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241025171137_LastViewedProject', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [StoryStatusChanges] (
    [Id] uniqueidentifier NOT NULL,
    [Timestamp] datetime2 NOT NULL,
    [StoryId] uniqueidentifier NOT NULL,
    [StoryStatus] int NOT NULL,
    CONSTRAINT [PK_StoryStatusChanges] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_StoryStatusChanges_Stories_StoryId] FOREIGN KEY ([StoryId]) REFERENCES [Stories] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_StoryStatusChanges_StoryId] ON [StoryStatusChanges] ([StoryId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241026113849_StoryStatusChange', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Stories] ADD [ResolveStart] datetime2 NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241026160704_ResolveStart', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [StoryStatusChanges] ADD [PreviousStoryStatus] int NOT NULL DEFAULT 0;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241026161114_PreviousStoryStatus', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Sprints] ADD [TeamId] uniqueidentifier NULL;
GO

CREATE INDEX [IX_Sprints_TeamId] ON [Sprints] ([TeamId]);
GO

ALTER TABLE [Sprints] ADD CONSTRAINT [FK_Sprints_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241026213454_TeamSprints', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Sprints] DROP CONSTRAINT [FK_Sprints_Teams_TeamId];
GO

DROP INDEX [IX_Sprints_TeamId] ON [Sprints];
DECLARE @var10 sysname;
SELECT @var10 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Sprints]') AND [c].[name] = N'TeamId');
IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [Sprints] DROP CONSTRAINT [' + @var10 + '];');
UPDATE [Sprints] SET [TeamId] = '00000000-0000-0000-0000-000000000000' WHERE [TeamId] IS NULL;
ALTER TABLE [Sprints] ALTER COLUMN [TeamId] uniqueidentifier NOT NULL;
ALTER TABLE [Sprints] ADD DEFAULT '00000000-0000-0000-0000-000000000000' FOR [TeamId];
CREATE INDEX [IX_Sprints_TeamId] ON [Sprints] ([TeamId]);
GO

ALTER TABLE [Sprints] ADD CONSTRAINT [FK_Sprints_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]) ON DELETE CASCADE;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241026213607_TeamSprintsRequired', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241026214549_SprintStoryClientSetNull', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241027210834_SprintStoryNoAction', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [StoryStatusChanges] ADD [UserId] uniqueidentifier NULL;
GO

CREATE INDEX [IX_StoryStatusChanges_UserId] ON [StoryStatusChanges] ([UserId]);
GO

ALTER TABLE [StoryStatusChanges] ADD CONSTRAINT [FK_StoryStatusChanges_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241029223251_StoryStatusChangeUser', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [StoryStatusChanges] DROP CONSTRAINT [FK_StoryStatusChanges_AspNetUsers_UserId];
GO

DROP INDEX [IX_StoryStatusChanges_UserId] ON [StoryStatusChanges];
DECLARE @var11 sysname;
SELECT @var11 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StoryStatusChanges]') AND [c].[name] = N'UserId');
IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [StoryStatusChanges] DROP CONSTRAINT [' + @var11 + '];');
UPDATE [StoryStatusChanges] SET [UserId] = '00000000-0000-0000-0000-000000000000' WHERE [UserId] IS NULL;
ALTER TABLE [StoryStatusChanges] ALTER COLUMN [UserId] uniqueidentifier NOT NULL;
ALTER TABLE [StoryStatusChanges] ADD DEFAULT '00000000-0000-0000-0000-000000000000' FOR [UserId];
CREATE INDEX [IX_StoryStatusChanges_UserId] ON [StoryStatusChanges] ([UserId]);
GO

ALTER TABLE [StoryStatusChanges] ADD CONSTRAINT [FK_StoryStatusChanges_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241029223429_StoryStatusChangeUserRequired', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Sprints] ADD [Capacity] int NOT NULL DEFAULT 0;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241030145636_SprintCapacity', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Stories] ADD [Tags] nvarchar(max) NOT NULL DEFAULT N'';
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241108172651_Tags', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var12 sysname;
SELECT @var12 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AspNetUsers]') AND [c].[name] = N'LastViewedProjectId');
IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [AspNetUsers] DROP CONSTRAINT [' + @var12 + '];');
ALTER TABLE [AspNetUsers] DROP COLUMN [LastViewedProjectId];
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241110144149_UserLastViewedProjectRemoved', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [SkillStory] (
    [RequiredSkillsId] uniqueidentifier NOT NULL,
    [StoriesId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_SkillStory] PRIMARY KEY ([RequiredSkillsId], [StoriesId]),
    CONSTRAINT [FK_SkillStory_Skills_RequiredSkillsId] FOREIGN KEY ([RequiredSkillsId]) REFERENCES [Skills] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_SkillStory_Stories_StoriesId] FOREIGN KEY ([StoriesId]) REFERENCES [Stories] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_SkillStory_StoriesId] ON [SkillStory] ([StoriesId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241113163455_StorySkills', N'8.0.3');
GO

COMMIT;
GO


