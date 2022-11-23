SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[InsertUpdateTransValueByCompanyId]
@PayrollFringeAddonID int,
@PayrollFringeHeaderID int,
@TransactionCodeId int,
@TransactionValueId int,
@createdby  int,
@ProdID int,
@CompanyID int

As

Begin

IF not exists(select * from PayrollFringeAddon where PayrollFringeAddonID=@PayrollFringeAddonID)

begin
INSERT INTO [dbo].[PayrollFringeAddon]
           ([PayrollFringeHeaderID]
           ,[TransactionCodeId]
           ,[TransactionValueId]
           ,[createddate]
           ,[createdby]
           ,[ProdID]
           ,[CompanyID])

		   
     VALUES
           (@PayrollFringeHeaderID,@TransactionCodeId, @TransactionValueId,getdate(),@createdby,@ProdID,@CompanyID) 


		   set @PayrollFringeAddonID=SCOPE_IDENTITY ()
         end  
		  else 
		  begin

		Update PayrollFringeAddon 
		Set PayrollFringeHeaderID=@PayrollFringeHeaderID,
		TransactionCodeId=@TransactionCodeId,
        TransactionValueId=@TransactionValueId,
		modifiedby=@createdby,
		ProdID=@ProdID,
		modifieddate=getdate()
		where PayrollFringeAddonID= @PayrollFringeAddonID
end
select @PayrollFringeAddonID
END





GO