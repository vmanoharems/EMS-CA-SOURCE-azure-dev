SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetUserGroupDetails]
	-- Add the parameters for the stored procedure here
@UserId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select CG.GroupName,CG.GroupId from UserAccess  UA
	left outer join CompanyGroup CG on CG.GroupId=UA.GroupID
	where UserID=@UserId
END




GO