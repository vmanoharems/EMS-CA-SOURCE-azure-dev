SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[insertUpdatepayrollbanksetup]
@PayrollBankSetupid int,
@DefaultCompanyID int,
@DefaultBankId int,
@DefaultCurrency nvarchar(50),
@PRSource int,
@APSource int,
@createdby int,
@ProdID int,
@VendorID int

As

Begin


IF not exists(select * from PayrollBankSetup where 
DefaultCompanyID=@DefaultCompanyID)
begin
INSERT INTO [dbo].[PayrollBankSetup]
           ([DefaultCompanyID]
           ,[DefaultBankId]
           ,[DefaultCurrency]
           ,[PRSource]
           ,[APSource]
           ,[createddate]
           ,[createdby]
           ,[ProdID]
		   ,[VendorID])
     VALUES
           (@DefaultCompanyID,@DefaultBankId,@DefaultCurrency,@PRSource,@APSource,getdate(),@createdby,@ProdID,@VendorID)    
		end   else 
		
		Update PayrollBankSetup 
		Set 
		DefaultCompanyID=@DefaultCompanyID,
		DefaultCurrency=@DefaultCurrency,
		DefaultBankId=@DefaultBankId,
		PRSource=@PRSource,
		APSource=@APSource,
		modifieddate=getdate(),
		VendorID =@VendorID 
		where DefaultCompanyID=@DefaultCompanyID

		
END





GO