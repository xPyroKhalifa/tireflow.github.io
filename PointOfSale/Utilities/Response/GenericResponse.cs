namespace PointOfSale.Utilities.Response
{
    public class GenericResponse<TObject>
    {
        public bool State { get; set; }
        public string? Message { get; set; }
        public TObject? Object { get; set; }
        public List<TObject>? ListObject { get; set; }
    }
}
