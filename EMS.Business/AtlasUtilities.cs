using EMS.Data;
using EMS.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Business
{
    public class AtlasUtilities
    {
        Data.AtlasUtilities DataContext = new Data.AtlasUtilities();
        public List<String> AtlasUtilities_SegmentsJSON(int ProdID)
        {
            try
            {
                var result = DataContext.AtlasUtilities_SegmentsJSON(ProdID);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<AtlasUtilities_Access_Result> AtlasUtilities_Access(int ProdID, int UserID, String securityhash)
        {
            try
            {
                var result = DataContext.AtlasUtilities_Access(ProdID, UserID, securityhash);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public APIAtlasUtilities_Config_Upsert_Result AtlasUtilities_Config_Upsert(int ConfigID, string ConfigName, string ConfigJSON, int ProdID, int? UserID)
        {
            try
            {
                var result = DataContext.AtlasUtilities_Config_Upsert(ConfigID, ConfigName, ConfigJSON, ProdID, UserID);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public APIAtlasUtilities_Config_Result AtlasUtilities_Config_Get(string ConfigName, int? ConfigID, int ProdID, int? UserID)
        {
            try
            {
                var result = DataContext.AtlasUtilities_Config_Get(ConfigName,ConfigID, ProdID, UserID);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<String> AtlasConfig_TransactionCodes(int ProdID)
        {
            try
            {
                var result = DataContext.AtlasConfig_TransactionCodes(ProdID);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
