using System;
using System.Collections.Generic;

namespace PointOfSale.Model
{
    public partial class CorrelativeNumber
    {
        public int IdCorrelativeNumber { get; set; }
        public int? LastNumber { get; set; }
        public int? QuantityDigits { get; set; }
        public string? Management { get; set; }
        public DateTime? DateUpdate { get; set; }
    }
}
