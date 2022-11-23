SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetVendorDetailByVendorID]   ---GetVendorDetailByVendorID 7,3


	
	@VendorID int,
	@ProdID int
AS
BEGIN
	
	Select v.[VendorID]
      , v.[VendorNumber]
      ,v.[VendorName]
      ,v.[FirstName]
      ,v.[MiddleName]
      ,v.[LastName]
      ,v.[PrintOncheckAS]
     ,v.[W9Country]
      ,v.[W9Address1]
      ,v.[W9Address2]
      ,v.[W9Address3]
      ,v.[W9City]
      ,v.[W9State]
      ,v.[W9Zip]
      ,v.[RemitCountry]
      ,v.[RemitAddress1]
      ,v.[RemitAddress2]
      ,v.[RemitAddress3]
      ,v.[RemitCity]
      ,v.[RemitState]
      ,v.[RemitZip]
      ,v.[UseRemmitAddrs]
      ,v.[Qualified]
      ,v.[Currency]
      ,v.[TaxID]
      ,v.[Type]
      ,v.[TaxFormOnFile]
      ,convert(varchar(10),v.[TaxFormExpiry],101) as TaxFormExpiry
      ,v.[DefaultForm]
      ,v.[TaxName]
      ,v.[ForeignTaxId]
      ,v.[PaymentType]
      ,Isnull(Duecount,0) as Duecount
      ,v.[Duetype]
      ,v.[netpercentage]
      ,v.[PaymentAccount]
      ,v.[Required]
      ,v.[StudioVendorNumber]
      ,v.[IsStudioApproved]
      ,v.[Status]
	  ,v.[Warning] 
	  ,v.[DefaultDropdown]
   
      ,v.[ProdID] 
	  ,v.COAId,v.COAString,v.SetId,v.SeriesId,v.TransactionCodeString,
	  t.accountcode as SetCode,tt.accountcode as SeriesCode,dbo.convertcodes(v.TransactionCodeString) as TransDetail
	  ,c.CountryCode as reCountryName
	  ,cc.CountryCode as w9CountryName

	  --,v.DefaultAccount
	  ,v.DefaultAccount from tblVendor v
	-- ,a.AccountCode as LedgerAccount,b.AccountCode as DefaultAccount from tblVendor v
     -- left outer  join TblAccounts a on a.AccountId=v.LedgerAccount 
	 left outer join Country C on c.CountryName=v.RemitCountry
	 left outer join Country Cc on cc.CountryName=v.W9Country
	 left outer join TblAccounts t on t.AccountId=v.SetId
	 left outer join TblAccounts tt on tt.AccountId=v.SeriesId

    --  left outer join TblAccounts b on  b.AccountId=v.DefaultAccount
	   
	 where v.VendorID=@VendorID and v.ProdID=@ProdID;
	  
END




GO