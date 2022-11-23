using EMS.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Data
{
    public class AtlasUtilities
    {
        Data.UtilityData utility = new Data.UtilityData(); // keep utility in place for easier migration for now

        public List<String> AtlasUtilities_SegmentsJSON(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.AtlasUtilities_SegmentsJSON(ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<AtlasUtilities_Access_Result> AtlasUtilities_Access(int ProdID, int UserID, String securityhash)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.AtlasUtilities_Access(ProdID, UserID, securityhash);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public APIAtlasUtilities_Config_Upsert_Result AtlasUtilities_Config_Upsert(int ConfigID,string ConfigName, string ConfigJSON, int ProdID, int? UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var response = DBContext.APIAtlasUtilities_Config_Upsert(ConfigID, ConfigName, ConfigJSON, ProdID, UserID).FirstOrDefault();
                    return response;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public APIAtlasUtilities_Config_Result AtlasUtilities_Config_Get(string ConfigName ,int? ConfigID, int ProdID, int? UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var response = DBContext.APIAtlasUtilities_Config(ConfigName, ConfigID, ProdID, UserID).FirstOrDefault();
                    return response;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<String> AtlasConfig_TransactionCodes(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.AtlasConfig_TransactionCodes(ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

    }
}
