using System;
using System.Text;
using System.Net.Http.Headers;
using System.Data.SqlClient;
using System.Data.Entity.Core.EntityClient;
using System.Configuration;
using EMS.Entity;

namespace EMS.Data
{
    public class AtlasSecurity
    {
        private HttpRequestHeaders _RequestHeaders;
        private string _DBName;
        public AtlasSecurity(HttpRequestHeaders RequestHeaders)
        {
            this._RequestHeaders = RequestHeaders;
            _DBName = Encoding.Default.GetString(Convert.FromBase64String(RequestHeaders.Authorization.Parameter)).Split(':')[2];
        }

        public string DBName
        {
            get
            {
                return _DBName;
            }
        }

        public CAEntities GetDBConnection()
        {
            try
            {
                string connectString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
                SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(connectString);

                string connectionString = @"metadata=res://*/EMS.csdl|res://*/EMS.ssdl|res://*/EMS.msl;provider=System.Data.SqlClient;provider connection string='data source="
                    + builder.DataSource + ";initial catalog="
                    + this._DBName + ";persist security info=True;user id="
                    + builder.UserID + ";password="
                    + builder.Password + ";MultipleActiveResultSets=True;App=EntityFramework'";

                EntityConnectionStringBuilder ecsBuilder = new EntityConnectionStringBuilder(connectionString);
                SqlConnectionStringBuilder sqlCsBuilder = new SqlConnectionStringBuilder(ecsBuilder.ProviderConnectionString)
                {
                    DataSource = @"" + builder.DataSource
                };

                ecsBuilder.ProviderConnectionString = sqlCsBuilder.ToString();
                CAEntities DataContexts = new CAEntities(ecsBuilder.ToString());
                return DataContexts;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}