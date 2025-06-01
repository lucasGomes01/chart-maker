namespace ChartMaker.Domain.Entities
{
    public class Chart
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}