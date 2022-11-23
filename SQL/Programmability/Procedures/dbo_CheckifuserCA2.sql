SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE Procedure [dbo].[CheckifuserCA2]

@Email nvarchar(100)
As 
begin
SET NOCOUNT ON;

if  exists (select *  from CAusers where Email=@Email)

begin
select 0;
end

else

begin
select 1;
end

END 


GO