using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class StoryStatusChangeUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "StoryStatusChanges",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StoryStatusChanges_UserId",
                table: "StoryStatusChanges",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_StoryStatusChanges_AspNetUsers_UserId",
                table: "StoryStatusChanges",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StoryStatusChanges_AspNetUsers_UserId",
                table: "StoryStatusChanges");

            migrationBuilder.DropIndex(
                name: "IX_StoryStatusChanges_UserId",
                table: "StoryStatusChanges");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "StoryStatusChanges");
        }
    }
}
