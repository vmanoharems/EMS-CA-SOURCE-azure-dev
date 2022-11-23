using EMS.Entity;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Data
{
    public class CheckCycleData
    {
        Data.UtilityData utility = new Data.UtilityData();
        public List<String> GetCheckCycle(JSONParameters JSONParameters)
        {

            CheckCycleEntity checkcycle = new CheckCycleEntity();
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    return DBContext.CheckCycleGet(JSONParameters.callPayload).ToList();
                    //checkcycle = JsonConvert.DeserializeObject<CheckCycleEntity>(sCheckcycle[0].ToString());
                    //return checkcycle;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
    }
}
