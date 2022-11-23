SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetCompanyDetail]  --exec GetCompanyDetail 5
(
@CompanyID int
)
AS
BEGIN
 -- SET NOCOUNT ON added to prevent extra result sets from
 -- interfering with SELECT statements.
 SET NOCOUNT ON;

 select a.CompanyCode,a.ProductionTitle,a.CompanyName,a.Address1,a.Address2,a.Address3,a.City,a.State,a.Country, a.Zip,a.CompanyPhone,a.Contact,a.Entry,a.Cost,a.Format ,
 b.federaltaxagency,b.federaltaxform,b.EIN,b.CompanyTCC,b.StateID,b.StatetaxID ,convert(varchar(10),[a].[FiscalStartDate],110) as FiscalStartDate,
 convert(varchar(10),[a].[PeriodStart],110) as PeriodStart,c.AccountingCurrency,c.ReportLabel,c.RealTimeCurrency,c.FringeAccountID,c.LaborAccountID,c.SuspenseAccountID,a.DefaultValue,a.PeriodStartType
 from Company as a
 left join taxinfo as b on a.CompanyID=b.CompanyID
 left join CompanySetting as c on a.CompanyID=c.CompanyID
  where a.CompanyID=@CompanyID

 

END



GO