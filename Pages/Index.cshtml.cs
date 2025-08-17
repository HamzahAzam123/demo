using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;

public class IndexModel : PageModel
{
    private readonly string connectionString = "Data Source=todos.db";

    [BindProperty]
    public string NewTask { get; set; }

    public List<string> Todos { get; set; } = new();

    public void OnGet()
    {
        CreateTableIfNotExists();
        LoadTodos();
    }

    public IActionResult OnPostAdd()
    {
        if (!string.IsNullOrWhiteSpace(NewTask))
        {
            AddTodo(NewTask);
        }
        return RedirectToPage(); // refresh page
    }

    private void CreateTableIfNotExists()
    {
        using var connection = new SqliteConnection(connectionString);
        connection.Open();

        var cmd = connection.CreateCommand();
        cmd.CommandText = @"
            CREATE TABLE IF NOT EXISTS Todos (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Task TEXT NOT NULL,
                IsDone INTEGER NOT NULL DEFAULT 0
            )";
        cmd.ExecuteNonQuery();
    }

    private void AddTodo(string task)
    {
        using var connection = new SqliteConnection(connectionString);
        connection.Open();

        var cmd = connection.CreateCommand();
        cmd.CommandText = "INSERT INTO Todos (Task, IsDone) VALUES ($task, $done)";
        cmd.Parameters.AddWithValue("$task", task);
        cmd.Parameters.AddWithValue("$done", 0);
        cmd.ExecuteNonQuery();
    }

    private void LoadTodos()
    {
        Todos.Clear();
        using var connection = new SqliteConnection(connectionString);
        connection.Open();

        var cmd = connection.CreateCommand();
        cmd.CommandText = "SELECT Task, IsDone FROM Todos";

        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            var task = reader.GetString(0);
            var done = reader.GetInt32(1) == 1;
            Todos.Add($"{task} {(done ? "[Done]" : "")}");
        }
    }
}
