namespace ChartMaker.Domain.Entities
{
    public class ChartData
    {
        public int Id { get; set; }
        public int ChartId { get; set; }
        public string Label { get; set; }
        public string Value { get; set; }

        public Chart Chart { get; set; }
    }
}
