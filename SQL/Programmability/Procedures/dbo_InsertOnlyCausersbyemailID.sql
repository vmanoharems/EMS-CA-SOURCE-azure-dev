CREATE Procedure [dbo].[InsertOnlyCausersbyemailID]
@AdminUserId int,
@EmailID varchar(100),
@Prodid int
As 
Begin

if not exists(select * from CAUsers where Email=@EmailID and ProdID=@Prodid)
begin
INSERT INTO [dbo].[CAUsers]
	([UserID],[ProdID],[Name],[Title],[Email],[Status],[Createddate],[modifieddate]
	,[createdby],[modifiedby],[GroupBatchAccess],[CanClose],[AllBatchAccess])
--VALUES
	select UserID, @ProdID, Email as [Name], 'EMS Support' as Title, Email, 1,getdate(),null
	, 1, null, 0, 0, 0
	from CAUserAdmin where UserID = @AdminUserId

	select SCOPE_IDENTITY() as causerid;

	INSERT INTO [dbo].[UserAccess]
		([UserID],[GroupID],[ProdID],[CreatedDate],[CreatedBy])
	VALUES
		(@AdminUserId,1,@Prodid,GETDATE(),1)

 end
		   
		   
else
	begin
	select causerid from CAUsers  where Email=@EmailID and ProdID=@Prodid;
	end
	end

GO