SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetVendorListByProdID] -- GetVendorListByProdID 14,'all'
	@ProdID int,
	@SortBy nvarchar(5)
AS
BEGIN
	if(@SortBy='All')
	begin
		SELECT distinct [VendorID]
		  ,[VendorNumber] 
		  ,[VendorName]  
		  ,[FirstName]
		  ,[MiddleName]
		  ,[LastName]
		  ,[PrintOncheckAS]
		  , (select case when W9Country='United States' then 'USA' else W9Country end) as [W9Country]
		  ,[W9Address1]
		  ,[W9Address2]
		  ,[W9Address3]
		  ,[W9City]
		  ,(select case when W9Country='United States' then SUBSTRING(CS.StateCode, CHARINDEX('US-', CS.StateCode) + 3, LEN(CS.StateCode)) else W9State end from CountryState CS where vnd.RemitState=CS.StateName and CS.Statetype='State')as [W9State]  
		  ,[W9Zip]
		  ,(select case when RemitCountry='United States' then 'USA' else RemitCountry end)as [RemitCountry]
		  ,[RemitAddress1]
		  ,[RemitAddress2]
		  ,[RemitAddress3]
		  ,[RemitCity]
		  ,(select case when RemitCountry='United States' then SUBSTRING(RCS.StateCode, CHARINDEX('US-', RCS.StateCode) + 3, LEN(RCS.StateCode)) else RemitState end from CountryState RCS where vnd.RemitState=RCS.StateName and RCS.Statetype='State')as RemitState  
		  ,[RemitZip]
		  ,[UseRemmitAddrs]
		  ,[Qualified]
		  ,[Currency]
		  ,[DefaultAccount]
		  ,[LedgerAccount]
		  ,[TaxID]
		  ,[Type]
		  ,[TaxFormOnFile]
		  ,convert(varchar(10),[TaxFormExpiry],101) as TaxFormExpiry   
		  ,[DefaultForm]
		  ,[TaxName]
		  ,[ForeignTaxId]
		  ,[PaymentType]
		  ,Isnull(Duecount,0) [Duecount] 
		  ,[Duetype]
		  ,[netpercentage]
		  ,[PaymentAccount]
		  ,[Required]
		  ,[StudioVendorNumber]
		  ,[IsStudioApproved]
		  ,[Status]
		  ,[Warning]
		  ,[DefaultDropdown]
		  ,[CreatedDate]
		  ,[CreatedBy]
		  ,[ModifiedDate]
		  ,[ModifiedBy]
		  ,[ProdID] from tblVendor vnd
	  where ProdID=@ProdID ORDER BY VendorName 
	end
	else
	begin
	if(@SortBy='%')
	begin
	set @SortBy='[^a-zA-Z]';
	end
		SELECT [VendorID]
		  ,[VendorNumber]
		  ,[VendorName]
		  ,[FirstName]
		  ,[MiddleName]
		  ,[LastName]
		  ,[PrintOncheckAS]
		  , (select case when W9Country='United States' then 'USA' else W9Country end) as [W9Country]
		  ,[W9Address1]
		  ,[W9Address2]
		  ,[W9Address3]
		  ,[W9City]
		  ,(select case when W9Country='United States' then SUBSTRING(CS.StateCode, CHARINDEX('US-', CS.StateCode) + 3, LEN(CS.StateCode)) else W9State end from CountryState CS where vnd.RemitState=CS.StateName and CS.Statetype='State')as [W9State]  
		  ,[W9Zip]
		  ,(select case when RemitCountry='United States' then 'USA' else RemitCountry end)as [RemitCountry]
		  ,[RemitAddress1]
		  ,[RemitAddress2]
		  ,[RemitAddress3]
		  ,[RemitCity]
		  ,(select case when RemitCountry='United States' then SUBSTRING(RCS.StateCode, CHARINDEX('US-', RCS.StateCode) + 3, LEN(RCS.StateCode)) else RemitState end from CountryState RCS where vnd.RemitState=RCS.StateName and RCS.Statetype='State')as RemitState  
		  ,[RemitZip]
		  ,[UseRemmitAddrs]
		  ,[Qualified]
		  ,[Currency]
		  ,[DefaultAccount]
		  ,[LedgerAccount]
		  ,[TaxID]
		  ,[Type]
		  ,[TaxFormOnFile]
		  ,convert(varchar(10),[TaxFormExpiry],101) as TaxFormExpiry
		  ,[DefaultForm]
		  ,[TaxName]
		  ,[ForeignTaxId]
		  ,[PaymentType]
		  ,Isnull(Duecount,0) [Duecount] 
		  ,[Duetype]
		  ,[netpercentage]
		  ,[PaymentAccount]
		  ,[Required]
		  ,[StudioVendorNumber]
		  ,[IsStudioApproved]
		  ,[Status]
		  ,[Warning]
		  ,[DefaultDropdown]
		  ,[CreatedDate]
		  ,[CreatedBy]
		  ,[ModifiedDate]
		  ,[ModifiedBy]
		  ,[ProdID] from tblVendor vnd
	  where ProdID=@ProdID and SUBSTRING(VendorName,1,1) like @SortBy +'%' ORDER BY VendorName 
	end
END
GO