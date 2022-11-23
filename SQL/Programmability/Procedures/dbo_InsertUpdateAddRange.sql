SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE  [dbo].[InsertUpdateAddRange]
@PayrollFringetableID int,
@FromCOA int,
@ToCOA int,
@FringeCOA int,
@createdby int,
@ProdID int,
@CompanyID int

	
	
AS
BEGIN
	
	SET NOCOUNT ON;

   
	if(@PayrollFringetableID=0)
	
	Begin  INSERT INTO [dbo].[PayrollFringetable]
       
		   ([FromCOA]
           ,[ToCOA]
           ,[FringeCOA]
           ,[createddate]
           ,[createdby]
           ,[ProdID]
		   ,[CompanyID])

	values(@FromCOA,@ToCOA,@FringeCOA,GETDATE(),@createdby,@ProdID,@CompanyID)
	End
	else
	Begin

	update  PayrollFringetable
	   set  [FromCOA]=FromCOA
           ,[ToCOA]=@ToCOA
           ,[FringeCOA]=@FringeCOA
           ,[modifieddate]=GETDATE()
           ,[modifiedby]=@createdby
           ,[ProdID]=@ProdID
		  , [CompanyID]=@CompanyID
            where PayrollFringetableID=@PayrollFringetableID;
	
	End

END




GO