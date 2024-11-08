using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class DeleteActions10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserTeam_AspNetUsers_MemberId",
                table: "UserTeam");

            migrationBuilder.AddForeignKey(
                name: "FK_UserTeam_AspNetUsers_MemberId",
                table: "UserTeam",
                column: "MemberId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserTeam_AspNetUsers_MemberId",
                table: "UserTeam");

            migrationBuilder.AddForeignKey(
                name: "FK_UserTeam_AspNetUsers_MemberId",
                table: "UserTeam",
                column: "MemberId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
