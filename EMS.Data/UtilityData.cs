using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Entity;
using EMS.Data;
using System.Configuration;
using System.Data.Entity.Core.EntityClient;
using System.Web;

namespace EMS.Data
{
    public class UtilityData
    {

        //Dell Config
        public CAEntities DBChange(string DatabaseName)
        {
            try
            {
                string DataSource = ""; string UserID = ""; string UserPassword = "";


                string connectString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
                SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(connectString);
                DataSource = builder.DataSource;
                UserID = builder.UserID;
                UserPassword = builder.Password;

                DatabaseName = @"metadata=res://*/EMS.csdl|res://*/EMS.ssdl|res://*/EMS.msl;provider=System.Data.SqlClient;provider connection string='data source=" + DataSource + ";initial catalog=" + DatabaseName + ";persist security info=True;user id=" + UserID + ";password=" + UserPassword + ";MultipleActiveResultSets=True;App=EntityFramework'";
                string connectionString = DatabaseName;
                EntityConnectionStringBuilder ecsBuilder = new EntityConnectionStringBuilder(connectionString);
                var sqlCsBuilder = new SqlConnectionStringBuilder(ecsBuilder.ProviderConnectionString)
                {
                    DataSource = @"" + DataSource
                };
                var providerConnectionString = sqlCsBuilder.ToString();
                ecsBuilder.ProviderConnectionString = providerConnectionString;
                string contextConnectionString = ecsBuilder.ToString();
                CAEntities DataContexts = new CAEntities(contextConnectionString);
                return DataContexts;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        internal CAEntities DBChange(int p)
        {
            throw new NotImplementedException();
        }
    }

    public class AdminToolsData
    {
        public AtlasAdminToolsEntities DBChange(string DatabaseName)
        {
            try
            {
                string DataSource = ""; string UserID = ""; string UserPassword = "";

                string connectString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
                SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(connectString);
                DataSource = builder.DataSource;
                UserID = builder.UserID;
                UserPassword = builder.Password;

                DatabaseName = @"metadata=res://*/EMS.csdl|res://*/EMS.ssdl|res://*/EMS.msl;provider=System.Data.SqlClient;provider connection string='data source=" + DataSource + ";initial catalog=" + DatabaseName + ";persist security info=True;user id=" + UserID + ";password=" + UserPassword + ";MultipleActiveResultSets=True;App=EntityFramework'";
                string connectionString = DatabaseName;
                EntityConnectionStringBuilder ecsBuilder = new EntityConnectionStringBuilder(connectionString);
                var sqlCsBuilder = new SqlConnectionStringBuilder(ecsBuilder.ProviderConnectionString)
                {
                    DataSource = @"" + DataSource
                };
                var providerConnectionString = sqlCsBuilder.ToString();
                ecsBuilder.ProviderConnectionString = providerConnectionString;
                string contextConnectionString = ecsBuilder.ToString();
                AtlasAdminToolsEntities DataContexts = new AtlasAdminToolsEntities(contextConnectionString);
                return DataContexts;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        internal AdminToolsData DBChange(int p)
        {
            throw new NotImplementedException();
        }
    }
}
