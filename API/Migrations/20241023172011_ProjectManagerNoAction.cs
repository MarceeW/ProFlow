using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class ProjectManagerNoAction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invitations_AspNetUsers_CreatedById",
                table: "Invitations");

            migrationBuilder.DropForeignKey(
                name: "FK_Stories_AspNetUsers_AssignedToId",
                table: "Stories");

            migrationBuilder.AddForeignKey(
                name: "FK_Invitations_AspNetUsers_CreatedById",
                table: "Invitations",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Stories_AspNetUsers_AssignedToId",
                table: "Stories",
                column: "AssignedToId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invitations_AspNetUsers_CreatedById",
                table: "Invitations");

            migrationBuilder.DropForeignKey(
                name: "FK_Stories_AspNetUsers_AssignedToId",
                table: "Stories");

            migrationBuilder.AddForeignKey(
                name: "FK_Invitations_AspNetUsers_CreatedById",
                table: "Invitations",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Stories_AspNetUsers_AssignedToId",
                table: "Stories",
                column: "AssignedToId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
