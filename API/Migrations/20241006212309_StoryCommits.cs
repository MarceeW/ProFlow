using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class StoryCommits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StoryCommit_AspNetUsers_CommiterId",
                table: "StoryCommit");

            migrationBuilder.DropForeignKey(
                name: "FK_StoryCommit_Stories_StoryId",
                table: "StoryCommit");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StoryCommit",
                table: "StoryCommit");

            migrationBuilder.RenameTable(
                name: "StoryCommit",
                newName: "StoryCommits");

            migrationBuilder.RenameIndex(
                name: "IX_StoryCommit_StoryId",
                table: "StoryCommits",
                newName: "IX_StoryCommits_StoryId");

            migrationBuilder.RenameIndex(
                name: "IX_StoryCommit_CommiterId",
                table: "StoryCommits",
                newName: "IX_StoryCommits_CommiterId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StoryCommits",
                table: "StoryCommits",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StoryCommits_AspNetUsers_CommiterId",
                table: "StoryCommits",
                column: "CommiterId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StoryCommits_Stories_StoryId",
                table: "StoryCommits",
                column: "StoryId",
                principalTable: "Stories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StoryCommits_AspNetUsers_CommiterId",
                table: "StoryCommits");

            migrationBuilder.DropForeignKey(
                name: "FK_StoryCommits_Stories_StoryId",
                table: "StoryCommits");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StoryCommits",
                table: "StoryCommits");

            migrationBuilder.RenameTable(
                name: "StoryCommits",
                newName: "StoryCommit");

            migrationBuilder.RenameIndex(
                name: "IX_StoryCommits_StoryId",
                table: "StoryCommit",
                newName: "IX_StoryCommit_StoryId");

            migrationBuilder.RenameIndex(
                name: "IX_StoryCommits_CommiterId",
                table: "StoryCommit",
                newName: "IX_StoryCommit_CommiterId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StoryCommit",
                table: "StoryCommit",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StoryCommit_AspNetUsers_CommiterId",
                table: "StoryCommit",
                column: "CommiterId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StoryCommit_Stories_StoryId",
                table: "StoryCommit",
                column: "StoryId",
                principalTable: "Stories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
