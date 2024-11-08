using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class StoryStatusChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StoryStatusChanges",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StoryStatus = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoryStatusChanges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StoryStatusChanges_Stories_StoryId",
                        column: x => x.StoryId,
                        principalTable: "Stories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StoryStatusChanges_StoryId",
                table: "StoryStatusChanges",
                column: "StoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StoryStatusChanges");
        }
    }
}
