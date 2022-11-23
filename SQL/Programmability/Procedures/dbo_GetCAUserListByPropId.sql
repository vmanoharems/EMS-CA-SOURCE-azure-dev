SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetCAUserListByPropId]
	-- Add the parameters for the stored procedure here
	@PropId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select cu.UserID,CASE WHEN cu.Title='' THEN 'User' else  cu.Title end as Title ,case when  cu.Name='' then cu.Email else cu.Name end as Name,
	
	 Isnull(dbo.GetUserGroup(cu.UserID),'') as GroupName,0 as GroupId,cu.Status from 
	CAUsers cu where ProdID=@PropId

	

END












GO