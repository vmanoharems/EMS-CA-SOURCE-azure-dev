SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE  [dbo].[InsertUpdateAddOffsets]
@PayrollOffsetID int,
@OffsetType nvarchar(50),
@OffsetAccount int,
@Offsetdescription nvarchar(50),
@Active bit,
@createdby int,
@ProdID int,
@CompanyID int

	
	
AS
BEGIN
	
	SET NOCOUNT ON;

    
	if(@PayrollOffsetID=0)
	Begin Insert into PayrollOffset
	([OffsetType]
           ,[OffsetAccount]
           ,[Offsetdescription]
           ,[Active]
           ,[createddate]
           ,[createdby]
           ,[ProdID]
           ,[CompanyID])
	
	
	
	values(@OffsetType,@OffsetAccount,@Offsetdescription,@Active,getdate(),@createdby,@ProdID,@CompanyID)
	End
	else
	Begin

	update  PayrollOffset
	set [OffsetType]=@OffsetType

           ,[OffsetAccount]=@OffsetAccount
           ,[Offsetdescription]=@Offsetdescription
           ,[Active]=@Active
           ,[modifieddate]=GETDATE()
  
           ,[modifiedby]=@createdby
           ,[ProdID]=@ProdID
           ,[CompanyID]=@CompanyID  where PayrollOffsetID=@PayrollOffsetID;
	
	End

END




GO