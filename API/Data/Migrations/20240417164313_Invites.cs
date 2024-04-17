using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class Invites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "InvitationKey",
                table: "AspNetUsers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Invitations",
                columns: table => new
                {
                    Key = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Expires = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActivated = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invitations", x => x.Key);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_InvitationKey",
                table: "AspNetUsers",
                column: "InvitationKey");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Invitations_InvitationKey",
                table: "AspNetUsers",
                column: "InvitationKey",
                principalTable: "Invitations",
                principalColumn: "Key");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Invitations_InvitationKey",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Invitations");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_InvitationKey",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "InvitationKey",
                table: "AspNetUsers");
        }
    }
}
