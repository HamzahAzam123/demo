# Development

## Project Setup

### Create Directory

Create a new directory and `cd` into it.

```sh
mkdir demo && cd demo
```

### Create App

Create an ASP.NET Core Razor Pages app.

```sh
dotnet new webapp
```

### Trust HTTPS Certificate

On Windows, you need to trust the development HTTPS certificate.

```sh
dotnet dev-certs https --trust
```

> This adds the development certificate to the Windows certificate store so that your browser trusts it.

### Change Default Ports

You can change the default ports by editing the `Properties/launchSettings.json` file.

```json
{
  "$schema": "https://json.schemastore.org/launchsettings.json",
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "applicationUrl": "http://localhost:5000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "https": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "applicationUrl": "https://localhost:5001;http://localhost:5000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

> In this setup, HTTP is redirected to HTTPS. You can only access the app at `https://localhost:5001` in your browser. This is because the `Program.cs` file configures the app to use HTTPS redirection (`app.UseHttpsRedirection();`).

### Run App

Run the project.

```sh
dotnet run --launch-profile https
```

> The app will be available at `https://localhost:5001` in your browser.

## File Structure

Now that something is working, let's look at the app's file structure.

- `Pages/`: Web pages that are rendered in the browser.

  - `Index.cshtml` / `Index.cshtml.cs`: The home page. The `.cshtml` file contains the markup, and the `.cshtml.cs` file contains the C# page model and business logic.
  - `Privacy.cshtml` / `Privacy.cshtml.cs`: An example privacy page.
  - `Error.cshtml` / `Error.cshtml.cs`: Displayed when something goes wrong in the app.
  - `Shared/_Layout.cshtml`: A global template applied to every page. It contains the header, footer, and other elements shared across all pages.
  - `_ViewStart.cshtml`: Tells the app to use `_Layout.cshtml` for every page.
  - `_ViewImports.cshtml`: Imports common directives and namespaces used on every page.

- `wwwroot/`: Public static files that your app can serve directly to the browser (images, CSS, and other assets).

  - `css/site.css`: Your site's CSS (colors, spacing, fonts).
  - `js/site.js`: Small bits of client-side JavaScript (if needed).
  - `lib/`: Third-party front-end libraries used in your app (for example, Bootstrap or jQuery).
  - `favicon.ico`: The small icon you see in the browser tab.

- `Properties/`: Configuration files that define how the app runs locally.

  - `launchSettings.json`: Configures local URLs/ports and other settings.

- `appsettings.json`: App settings that apply to all environments (local and production), such as connection strings, feature flags, and logging levels.

- `appsettings.Development.json`: Similar to `appsettings.json`, but used only when running the app locally.

- `Program.cs`: The app's entry point (the first file that runs when the app starts). It's like the first domino that falls and starts the whole app.

- `demo.csproj`: The project file. Basically a "recipe" that tells .NET what the app is, which packages it uses, and how to build it.

- `bin/`: After a build, the compiled app goes here.

- `obj/`: Mostly temporary files and caches used by the build system. Don't edit anything here.

## Push to GitHub

### Create Repository

In GitHub, create a new public repository named `demo`.

### Initialize Git and Push to Github

In a terminal at the root of your project, run:

```sh
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:<your-username>/demo.git
git push -u origin main
```

> Replace `<your-username>` with your actual GitHub username.
