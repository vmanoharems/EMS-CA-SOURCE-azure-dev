SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE function [dbo].[GetUserGroup](@Userid int) RETURNS varchar(Max)
begin

	DECLARE @Groups VARCHAR(MAX);
	
	select @Groups = Coalesce(@Groups+', ','') + CG.GroupName from UserAccess UA inner join 
	CompanyGroup CG on CG.GroupId=UA.GroupID
	  
	   where UA.UserID=@Userid
	
	if @Groups='' or @Groups is null
	set @Groups='-'
	
	return @Groups

 end


GO