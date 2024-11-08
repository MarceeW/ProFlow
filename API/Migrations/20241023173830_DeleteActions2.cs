using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class DeleteActions2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stories_AspNetUsers_AssignedToId",
                table: "Stories");

            migrationBuilder.AddForeignKey(
                name: "FK_Stories_AspNetUsers_AssignedToId",
                table: "Stories",
                column: "AssignedToId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stories_AspNetUsers_AssignedToId",
                table: "Stories");

            migrationBuilder.AddForeignKey(
                name: "FK_Stories_AspNetUsers_AssignedToId",
                table: "Stories",
                column: "AssignedToId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
