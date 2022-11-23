SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE  PROCEDURE  [dbo].[InsertUpdateFringeByCompanyId]
@PayrollFringeHeaderID int,
@StartRange int,
@EndRange int,
@LOId int,
@EpiId int,
@SetId int,
@BananasId int,

@FringeAccount int,
@ProdID int,
@createdby int,
@CompanyID int
	
	
AS
BEGIN
	
	SET NOCOUNT ON;

   
	if(@PayrollFringeHeaderID=0)
	
	Begin 
       
		 INSERT INTO [dbo].[PayrollFringeHeader]
           ([StartRange]
           ,[EndRange]
           ,[LOId]
           ,[EpiId]
           ,[SetId]
           ,[BananasId]
          
           ,[FringeAccount]
           ,[ProdID]
           ,[createddate]
           ,[createdby]
          ,[CompanyID])

	values(@StartRange,@EndRange ,@LOId,@EpiId,@SetId,@BananasId,@FringeAccount,@ProdID,GETDATE(),@createdby,@CompanyID )
	End
	else
	Begin

	update  PayrollFringeHeader
	   set  [StartRange]=@StartRange
	        ,[LOId]=@LOId
	        ,[EpiId]=@EpiId
           ,[SetId]=@SetId 
           ,[BananasId]=@BananasId
		   
		   ,[FringeAccount]=@FringeAccount
           ,[modifieddate]=GETDATE()
           ,[modifiedby]=@createdby
           ,[ProdID]=@ProdID
		  , [CompanyID]=@CompanyID


            where @PayrollFringeHeaderID=@PayrollFringeHeaderID ;
	
	End

END
 



GO