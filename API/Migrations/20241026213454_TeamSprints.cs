using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class TeamSprints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TeamId",
                table: "Sprints",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sprints_TeamId",
                table: "Sprints",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sprints_Teams_TeamId",
                table: "Sprints",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sprints_Teams_TeamId",
                table: "Sprints");

            migrationBuilder.DropIndex(
                name: "IX_Sprints_TeamId",
                table: "Sprints");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "Sprints");
        }
    }
}
