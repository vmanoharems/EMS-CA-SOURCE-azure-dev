using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data.Entity.Core.EntityClient;
using System.Data.Entity;
using System.Configuration;

// Possible MAJOR bug with concurrent connections #3819
// 2019-07-14 Confirmed this can result in crossover of data from one DB to another because the global var can become changed from one API call to the next when multiple DBs are in use
// 2019-10-27 Should use new AtlasSecurity object
namespace EMS.Entity
{
    public static class ConnnectionString
    {
        static string _globalValue;
        public static string GlobalValue
        {
            get
            {
                return _globalValue;
            }
            set
            {
                _globalValue = value;
            }
        }

    }

   
   
}
