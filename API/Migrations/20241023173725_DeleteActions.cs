using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class DeleteActions : Migration
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

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_AspNetUsers_TeamLeaderId",
                table: "Teams");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_AspNetUsers_TeamLeaderId",
                table: "Teams",
                column: "TeamLeaderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
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

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_AspNetUsers_TeamLeaderId",
                table: "Teams");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_AspNetUsers_TeamLeaderId",
                table: "Teams",
                column: "TeamLeaderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
