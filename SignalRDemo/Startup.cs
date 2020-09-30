using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using SignalRDemo.Hubs;
using SignalRDemo.Providers;

namespace SignalRDemo
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<ValidateMimeMultipartContentFilter>();

            var sqlConnectionString = Configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<NewsContext>(options =>
                                                   options.UseSqlite(
                                                       sqlConnectionString
                                                   ), ServiceLifetime.Singleton
            );

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                                             builder
                                                 .WithOrigins("http://localhost:4201")
                                                 .AllowAnyHeader()
                                                 .AllowAnyMethod()
                                                 .AllowCredentials()
                );
            });

            services.AddSingleton<NewsStore>();

            services.AddSignalR()
                    .AddMessagePackProtocol();

            services.AddControllersWithViews();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            //app.UseAuthorization();

            app.UseCors();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<LoopyHub>("/loopy");
                endpoints.MapHub<NewsHub>("/loopey");
                endpoints.MapHub<LoopyMessageHub>("/loopymessage");
                endpoints.MapHub<ImagesMessageHub>("/zub");

                endpoints.MapControllers();
            });
        }
    }
}