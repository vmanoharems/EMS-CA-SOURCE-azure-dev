SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[GetUserlist]
	
	@Prodid int

AS
BEGIN
	
	SET NOCOUNT ON;

    select users.Userid,users.Name,users.Title,groups.Groupname,groups.GroupId  from users 
	inner  join usergroups ON users.userid=usergroups.userid 
	inner join groups on usergroups.groupid=groups.groupid
	where users.Prodid=@ProdId
	order by Users.Name

END




GO