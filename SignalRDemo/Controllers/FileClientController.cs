using Microsoft.AspNetCore.Mvc;

namespace SignalRDemo.Controllers
{
    public class FileClientController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Index Page";

            return View();
        }
    }
}
