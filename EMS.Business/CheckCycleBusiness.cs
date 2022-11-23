using EMS.Data;
using EMS.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Business
{
    public class CheckCycleBusiness
    {
        CheckCycleData DataContext = new CheckCycleData();
        public List<String> GetCheckCycle(JSONParameters JSONParameters)
        {
            var result = DataContext.GetCheckCycle(JSONParameters);
            return result;
        }
    }
}
