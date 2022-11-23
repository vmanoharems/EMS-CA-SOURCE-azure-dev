SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertUserAccess]
	-- Add the parameters for the stored procedure here
	@UserId int,
	@GroupId nvarchar(50),
	@ProdId int,
	@CreatedBy int
AS
BEGIN
	SET NOCOUNT ON;
	delete from UserAccess where UserID=@UserId
	declare @CCount int
	SELECT @CCount= Count(*) FROM dbo.SplitId(@GroupId,',')
--------------------------------------------------------
DECLARE User_Group CURSOR FOR 
SELECT items FROM dbo.SplitId(@GroupId,',')
OPEN User_Group
declare @GroupItem INT
FETCH NEXT FROM User_Group 
INTO @GroupItem
WHILE @@FETCH_STATUS = 0
BEGIN
insert into UserAccess(UserID,GroupID,ProdID,CreatedBy,CreatedDate) values(@UserId,@GroupItem,@ProdId,@CreatedBy,GETDATE())
FETCH NEXT FROM User_Group 
INTO @GroupItem
   end
    CLOSE User_Group
DEALLOCATE User_Group




END




GO