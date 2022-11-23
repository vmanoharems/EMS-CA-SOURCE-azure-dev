using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Entity;

namespace EMS.Data
{
    public class LedgerData
    {
        Data.UtilityData utility = new Data.UtilityData();
        public int SaveCompnayAccounts(List<AccountCreationCompany> ObjACC)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    foreach (var item in ObjACC)
                    {
                        var a = DBContext.SaveCompnayAccounts(item.CreatedBy, item.ProdId, item.ACCountCode, item.AccountName);
                    }

                    return 0;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public int InsertUpdateAccounts(List<TblAccount> TblAcc)
        {
            int ret = 0;
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {

                try
                {
                    foreach (var TA in TblAcc)
                    {
                        var result = DBContext.InsertUpdateAccounts(TA.AccountId,
                            TA.SegmentId, TA.AccountCode, TA.AccountName, TA.AccountTypeId, TA.BalanceSheet,
                            TA.Status, TA.Posting, TA.SubLevel, TA.SegmentType, TA.ParentId,
                         TA.CreatedBy, TA.ProdId
                              ).FirstOrDefault();
                        ret = Convert.ToInt32(result);

                        var result1 = DBContext.SingleActionCOA(ret);
                        if (Convert.ToInt32(TA.SubLevel) == 1)
                        {
                            var result2 = DBContext.LoadMissingAccountLevel1(TA.CreatedBy, TA.ProdId);
                        }
                        else if (Convert.ToInt32(TA.SubLevel) == 2)
                        {
                            var result2 = DBContext.LoadMissingAccountLevel2(TA.CreatedBy, TA.ProdId);
                        }
                        else
                        {
                            var result2 = DBContext.LoadMissingAccountAfterL2(TA.CreatedBy, TA.ProdId);
                        }
                    }

                    return ret;
                }
                catch (Exception ex)
                {
                    throw ex;
                }


            }
        }

        public List<CheckLedgerExistance_Result> CheckLedgerExistance(string DetailCode, int ParentId, int Sublevel)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.CheckLedgerExistance(DetailCode, ParentId, Sublevel);
                    return result.ToList();
                }
                catch (Exception ex)
                { throw ex; }
            }
        }
        public List<GetTblAccountDetailsByCategory_Result> GetTblAccountDetailsByCategory(int ProdId, string Category)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetTblAccountDetailsByCategory(ProdId, Category);
                    return result.ToList();
                }
                catch (Exception ex)
                { throw ex; }
            }

        }
        public List<GetCompanyDetailForAccount_Result> GetCompanyDetailForAccount(int ProdId)
        {

            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetCompanyDetailForAccount(ProdId);
                    return result.ToList();
                }
                catch (Exception ex)
                { throw ex; }
            }
        }


        public List<GetAccountTypeForGL_Result> GetAccountTypeForGL(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetAccountTypeForGL(ProdId);
                    return result.ToList();
                }
                catch (Exception ex)
                { throw ex; }
            }

        }

        public List<GetBudgetCategoryForGL_Result> GetBudgetCategoryForGL(int Budgetfileid, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetBudgetCategoryForGL(Budgetfileid, ProdID);
                    return result.ToList();
                }
                catch (Exception ex)
                { throw ex; }
            }

        }

        public List<GetBudgetAccountForGL_Result> GetBudgetAccountForGL(int Budgetfileid, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetBudgetAccountForGL(Budgetfileid, ProdID);
                    return result.ToList();
                }
                catch (Exception ex)
                { throw ex; }
            }

        }


        public List<GetBudgetDetailForGL_Result> GetBudgetDetailForGL(int Budgetfileid, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetBudgetDetailForGL(Budgetfileid, ProdID);
                    return result.ToList();
                }
                catch (Exception ex)
                { throw ex; }
            }

        }
        public List<GetAllDetailOfTblAccount_Result> GetAllDetailOfTblAccount(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetAllDetailOfTblAccount(ProdId);
                return result.ToList();

            }

        }
        public List<ReportsLedgerCOAJSON_Result> ReportsLedgerCOAJSON(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.ReportsLedgerCOAJSON(callParameters.callPayload);
                return result.ToList();

            }
        }
        public List<GetAccountDetailByProdId_Result> GetAccountDetailByProdId(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetAccountDetailByProdId(ProdId);
                return result.ToList();

            }
        }

        public void GenerateCOA(GenerateCOA objCOA)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {


                    var result = DBContext.GenerateCOA(
                        objCOA.ProdID, objCOA.s1, objCOA.s2, objCOA.s3, objCOA.s4, objCOA.s5,
                        objCOA.s6, objCOA.s7, objCOA.s8

                        );

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {

                }
            }
        }
        public List<GetCOAbyProdId_Result> GetCOAbyProdId(int ProdId, string COAString)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetCOAbyProdId(ProdId, COAString);
                return result.ToList();
            }
        }
        public List<GetLedgerDetailByProdId_Result> GetLedgerDetailByProdId(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetLedgerDetailByProdId(ProdId);
                return result.ToList();
            }
        }
        public List<GetCOAListByCompany_Result> GetCOAListByCompany(int ProdId, string CodeString)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetCOAListByCompany(ProdId, CodeString);
                return result.ToList();
            }
        }


        public int InsertupdateCOAManual(COA _COA)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.InsertupdateCOAManual(_COA.COACode
           , _COA.ParentCode
           , _COA.Description
           , _COA.SS1
           , _COA.SS2
           , _COA.SS3
           , _COA.SS4
           , _COA.SS5
           , _COA.SS6
           , _COA.SS7
           , _COA.SS8, _COA.AccountId,
           _COA.DetailLevel
           , _COA.ProdId).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }

        public List<GetTransactionNumber_Result> GetTransactionNumber(int ProdId, int CreatedBy)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetTransactionNumber(ProdId, CreatedBy);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetCOABySegmentPosition_Result> GetCOABySegmentPosition(string COACode, int ProdId, int SegmentPosition)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetCOABySegmentPosition(COACode, ProdId, SegmentPosition);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetCOABySegmentPosition1_Result> GetCOABySegmentPosition1(string COACode, int ProdId, int SegmentPosition)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetCOABySegmentPosition1(COACode, ProdId, SegmentPosition);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public int SaveJE(JEClass ObjJE)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (System.Data.Entity.DbContextTransaction dbContextTransaction = DBContext.Database.BeginTransaction())
            {
                try
                {
                    JournalEntry strjE = ObjJE.objJE;
                    List<JournalEntryDetail> strJED = ObjJE.objJEDetail;

                    var result = DBContext.InsertupdateJournalEntry(
                        strjE.JournalEntryId, strjE.TransactionNumber, strjE.Source, strjE.Description, strjE.EntryDate
                        , strjE.DebitTotal, strjE.CreditTotal, strjE.TotalLines, strjE.ImbalanceAmount, strjE.AuditStatus
                        , strjE.PostedDate, strjE.ReferenceNumber, strjE.BatchNumber, strjE.ProdId, strjE.createdBy,
                        strjE.ClosePeriod, strjE.CompanyId, strjE.DocumentNo, strjE.CurrencyTransaction
                    ).FirstOrDefault();

                    string rtn = "";
                    foreach (JournalEntryDetail item in strJED)
                    {
                        rtn = DBContext.InsertUpdateJEDetail(
                            result, item.JournalEntryDetailId, item.TransactionLineNumber, item.COAId, item.DebitAmount, item.CreditAmount
                            , item.VendorId, item.VendorName, item.ThirdParty, item.Note, item.CompanyId, item.ProdId, item.CreatedBy
                            , item.COAString, item.TransactionCodeString, item.SetId, item.SeriesId, item.TaxCode
                        ).FirstOrDefault();
                    }
                    DBContext.UpdateJournalEntryForLines(result);
                    dbContextTransaction.Commit();
                    return Convert.ToInt32(rtn);
                }
                catch (Exception ex)
                {
                    dbContextTransaction.Rollback();
                    throw ex;
                }
            }
        }

        public List<GetJournalEntryList_Result> GetJournalEntryList(int ProdId, string AuditStatus)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetJournalEntryList(ProdId, AuditStatus);
                return result.ToList();
            }
        }

        public List<GetClosePeriodDeomJE_Result> GetClosePeriodDeomJE(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetClosePeriodDeomJE(ProdID);
                return result.ToList();
            }
        }

        public List<GetStartEndPeriodByCompanyId_Result> GetStartEndPeriodByCompanyId(int CompanyID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetStartEndPeriodByCompanyId(CompanyID);
                return result.ToList();

            }
        }

        public int InsertUpdateClosePeriod(ClosePeriod _Close)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {

                try
                {
                    var result = DBContext.InsertUpdateClosePeriod(_Close.CompanyId,

                        _Close.Status,
                        _Close.ClosePeriodId,
                        _Close.CreatedBy,
                        _Close.EndPeriod
                        );
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }


        public List<GetJEDetailByJEId_Result> GetJEDetailByJEId(int JournalEntryId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetJEDetailByJEId(JournalEntryId);
                return result.ToList();
            }
        }
        public void DeleteJournalEntryDetailById(string JournalEntryDetailId, string Type)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                string[] jeDetailId = JournalEntryDetailId.Split(',');

                for (int i = 0; i < jeDetailId.Length; i++)
                {
                    if (jeDetailId[i] != "")
                    {
                        var result = DBContext.DeleteJournalEntryDetailById(Convert.ToInt32(jeDetailId[i]), Type);
                    }
                }


            }
        }
        public List<GetJournalEntryDetailTransValue_Result> GetJournalEntryDetailTransValue(int journalEntryId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetJournalEntryDetailTransValue(journalEntryId);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
        }
        public List<GetJournalEntryDetailByStatus_Result> GetJournalEntryDetailByStatus(int ProdId, int StartTransaction, int EndTransaction)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetJournalEntryDetailByStatus(ProdId, StartTransaction, EndTransaction);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetJEDetailForAdjutment_Result> GetJEDetailForAdjutment(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetJEDetailForAdjutment(ProdId);
                return result.ToList();
            }
        }
        public int UpdateJEDDetailByType(UpdateJournalEntry UPE)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateJEDDetailByType(
                    UPE.Type, UPE.JEDId, UPE.TransactionString
                    );
                return 0;
            }
        }
        public List<GetClosePeriodStatus_Result> GetClosePeriodStatus(int CompanyId, int ClosePeriodID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetClosePeriodStatus(CompanyId, ClosePeriodID);
                return result.ToList();
            }
        }
        //public List<GetListForTrialBalance_Result> GetListForTrialBalance(TrailBalanceList _TB)
        //{
        //    CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
        //    using (DBContext)
        //    {
        //        try
        //        {
        //            var result = DBContext.GetListForTrialBalance(
        //                 _TB.ProdId, _TB.FromDate, _TB.ToDate
        //                );
        //            return result.ToList();
        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }
        //    }
        //}
        public List<UpdateJournalEntryStatusById_Result> UpdateJournalEntryStatusById(string JEId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var restult = DBContext.UpdateJournalEntryStatusById(JEId);
                return restult.ToList();
            }

        }
        public int DeleteTblAccountById(int AccountId, string SegmentType)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.DeleteTblAccountById(AccountId, SegmentType).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }
        public List<GetJEListForDistribution_Result> GetJEListForDistribution(int prodId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetJEListForDistribution(prodId);
                return result.ToList();
            }
        }
        public int UpdateCOADescriptionById(int COAId, string Description)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateCOADescriptionById(COAId, Description);
                return 0;
            }
        }
        public List<GetDetailAccountNoParent_Result> GetDetailAccountNoParent(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetDetailAccountNoParent(ProdId);
                return result.ToList(); ;
            }
        }
        public int GeteverseJEDetail(int JournalEntryId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GeteverseJEDetail(JournalEntryId).FirstOrDefault();
                return Convert.ToInt32(result);
            }

        }


        //================new trial================//
        public List<GetListForTrailBalance_Result> GetListForTrailBalance(TrailBalanceListNew _TBNew)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetListForTrailBalance(
                         _TBNew.ProdId, _TBNew.CompanyCode, _TBNew.Segmentcode, _TBNew.FromDate, _TBNew.ToDate
                        );
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetJEntryByJEId_Result> GetJEntryByJEId(int JournalEntryId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetJEntryByJEId(JournalEntryId);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public void DeleteJEandJEDetail(int JournalEntryId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.DeleteJEandJEDetail(JournalEntryId);

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetJEDetailFilter_Result> GetJEDetailFilter(JEFilter JEF)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetJEDetailFilter(
                        JEF.ProdId, JEF.ss1, JEF.ss2, JEF.ss3, JEF.ss4, JEF.ss5, JEF.START,
                         JEF.End, JEF.VendorIds, JEF.CompanyId, JEF.Currency, JEF.Period, JEF.Source, JEF.SetId,
                          JEF.Type, JEF.DocumentNo
                        );
                    return result.ToList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetCOABySegmentNumber_Result> GetCOABySegmentNumber(int ProdId, int Segment)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetCOABySegmentNumber(ProdId, Segment);
                    return result.ToList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetTBByEP_Result> GetTBByEP(TrailBalanceList _TB)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetTBByEP(_TB.CompanyId, _TB.FromDate, _TB.ToDate, _TB.ProdId);
                    return result.ToList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetTBByLevel1Ep_Result> GetTBByLevel1Ep(TrailBalanceList _TB)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetTBByLevel1Ep(_TB.CompanyId, _TB.FromDate, _TB.ToDate, _TB.ProdId);
                    return result.ToList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetTBByLevel1NonEp_Result> GetTBByLevel1NonEp(TrailBalanceList _TB)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetTBByLevel1NonEp(_TB.CompanyId, _TB.FromDate, _TB.ToDate, _TB.ProdId);
                    return result.ToList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public int PostedCollectionInit(int PostedUserID, string PostingType, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    return DBContext.PostedCollectionInsert(PostedUserID, PostingType, ProdID).FirstOrDefault(); // This sp always returns a single result
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public int PostedCollectionTransactions(int CollectionID, string JEIDJSON, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    return DBContext.PostedCollectionTransactionsInsert(CollectionID, JEIDJSON, ProdID).FirstOrDefault(); // This sp always returns a single result
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<String> TransactionListbyAccountCode(int ProdID, string AccountCodes)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.TransactionListbyAccountCode(ProdID, AccountCodes);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<PostCollectionList_Result> PostCollectionList(int ProdID, int UserID, string PostingType)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    return DBContext.PostCollectionList(ProdID, UserID, PostingType).ToList(); // This sp always returns a single result
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

    }
}
