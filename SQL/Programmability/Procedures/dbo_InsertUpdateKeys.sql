SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[InsertUpdateKeys]

@PayrollKeyID int,
@RCPKey nvarchar(200),
@RCPPrinterKey nvarchar(200),
@PayrollKeyValue nvarchar(200),
@createdby  int,
@ProdID int,
@CompanyId int


As

Begin


IF not exists(select * from PayrollKeys where CompanyId=@CompanyId)

begin
	INSERT INTO [dbo].[PayrollKeys]
           ([RCPKey]
           ,[RCPPrinterKey]
           ,[PayrollKeyValue]
           ,[createddate]
           ,[createdby]
           ,[ProdID]
		   ,[CompanyId])
		   
     VALUES
           (@RCPKey,@RCPPrinterKey, @PayrollKeyValue,getdate(),@createdby,@ProdID,@CompanyId) 
         end  
		  else 
		Update PayrollKeys 
		Set 
		RCPKey=@RCPKey,
		RCPPrinterKey=@RCPPrinterKey,
        PayrollKeyValue=@PayrollKeyValue,
		modifiedby=@createdby,
		ProdID=@ProdID,
		modifieddate=getdate()
		
		where CompanyId= @CompanyId
END


-- select * from PayrollKeys


GO