using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamLeaderProject_AspNetUsers_UserId",
                table: "TeamLeaderProject");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamLeaderProject_Projects_ProjectId",
                table: "TeamLeaderProject");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamProject_Projects_ProjectId",
                table: "TeamProject");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamProject_Teams_TeamId",
                table: "TeamProject");

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_AspNetUsers_TeamLeaderId",
                table: "Teams");

            migrationBuilder.DropForeignKey(
                name: "FK_UserTeam_AspNetUsers_UserId",
                table: "UserTeam");

            migrationBuilder.DropForeignKey(
                name: "FK_UserTeam_Teams_TeamId",
                table: "UserTeam");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserTeam",
                table: "UserTeam");

            migrationBuilder.DropIndex(
                name: "IX_UserTeam_UserId",
                table: "UserTeam");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "UserTeam",
                newName: "MemberId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserTeam",
                table: "UserTeam",
                columns: new[] { "MemberId", "TeamId" });

            migrationBuilder.CreateIndex(
                name: "IX_UserTeam_TeamId",
                table: "UserTeam",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamLeaderProject_AspNetUsers_UserId",
                table: "TeamLeaderProject",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamLeaderProject_Projects_ProjectId",
                table: "TeamLeaderProject",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamProject_Projects_ProjectId",
                table: "TeamProject",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamProject_Teams_TeamId",
                table: "TeamProject",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_AspNetUsers_TeamLeaderId",
                table: "Teams",
                column: "TeamLeaderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserTeam_AspNetUsers_MemberId",
                table: "UserTeam",
                column: "MemberId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserTeam_Teams_TeamId",
                table: "UserTeam",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamLeaderProject_AspNetUsers_UserId",
                table: "TeamLeaderProject");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamLeaderProject_Projects_ProjectId",
                table: "TeamLeaderProject");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamProject_Projects_ProjectId",
                table: "TeamProject");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamProject_Teams_TeamId",
                table: "TeamProject");

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_AspNetUsers_TeamLeaderId",
                table: "Teams");

            migrationBuilder.DropForeignKey(
                name: "FK_UserTeam_AspNetUsers_MemberId",
                table: "UserTeam");

            migrationBuilder.DropForeignKey(
                name: "FK_UserTeam_Teams_TeamId",
                table: "UserTeam");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserTeam",
                table: "UserTeam");

            migrationBuilder.DropIndex(
                name: "IX_UserTeam_TeamId",
                table: "UserTeam");

            migrationBuilder.RenameColumn(
                name: "MemberId",
                table: "UserTeam",
                newName: "UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserTeam",
                table: "UserTeam",
                columns: new[] { "TeamId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_UserTeam_UserId",
                table: "UserTeam",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamLeaderProject_AspNetUsers_UserId",
                table: "TeamLeaderProject",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamLeaderProject_Projects_ProjectId",
                table: "TeamLeaderProject",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamProject_Projects_ProjectId",
                table: "TeamProject",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamProject_Teams_TeamId",
                table: "TeamProject",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_AspNetUsers_TeamLeaderId",
                table: "Teams",
                column: "TeamLeaderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserTeam_AspNetUsers_UserId",
                table: "UserTeam",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserTeam_Teams_TeamId",
                table: "UserTeam",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
