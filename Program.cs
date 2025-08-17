using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// --- Ensure database and table exist at startup ---
string connectionString = "Data Source=todos.db";

using (var connection = new SqliteConnection(connectionString))
{
    connection.Open();

    var createCmd = connection.CreateCommand();
    createCmd.CommandText = @"
        CREATE TABLE IF NOT EXISTS Todos (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Task TEXT NOT NULL,
            IsDone INTEGER NOT NULL DEFAULT 0
        )";
    createCmd.ExecuteNonQuery();
}

// --- Use ASP.NET Core logger to print all existing ToDos ---
var logger = app.Logger;

void PrintTodos()
{
    using var connection = new SqliteConnection(connectionString);
    connection.Open();

    var cmd = connection.CreateCommand();
    cmd.CommandText = "SELECT Id, Task, IsDone FROM Todos";

    using var reader = cmd.ExecuteReader();
    logger.LogInformation("Todos in database:");
    while (reader.Read())
    {
        int id = reader.GetInt32(0);
        string task = reader.GetString(1);
        bool done = reader.GetInt32(2) == 1;
        logger.LogInformation($"{id}: {task} - {(done ? "Done" : "Pending")}");
    }
}

// Call it after ensuring the table exists
PrintTodos();
// --------------------------------------------------

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

app.MapRazorPages();

app.Run();
