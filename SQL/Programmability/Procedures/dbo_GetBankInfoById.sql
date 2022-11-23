SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetBankInfoById] -- GetBankInfoById 4
	-- Add the parameters for the stored procedure here
	@BankId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
select 
B.BankId,B.Bankname,B.CompanyId,B.Address1,B.Address2,B.Address3,B.city,B.State,B.zip,B.Country,
B.RoutingNumber,B.AccountNumber,B.BranchNumber,B.Branch,B.Clearing,B.Cash,B.Suspense,B.Bankfees,B.Deposits
,B.SourceCodeID,B.CurrencyID,B.Status as BankStatus,B.PostiivePay,B.Prodid
,c.Style,c.Prefix,c.Length,c.StartNumber,c.EndNumber,c.Collated,c.PrintZero,c.Copies,c.TopMargin,
c.BottomMargin,c.LeftMargin,c.RightMargin,c.SectionOne,c.SectionTwo,c.SectionThree,c.Status as CheckStatus
,Co.CompanyCode,cu.CurrencyName,isnull(d.CountryCode,0) as CountryCode

from BankInfo B
left outer join CheckSetting  C on C.BankID=B.BankId
left outer join Company Co on Co.CompanyID=B.CompanyId
left outer join Currecny Cu on cu.CurrencyID=B.CurrencyID
left outer join Country as d on b.Country=d.CountryName
 where B.BankId=@BankId
END



GO