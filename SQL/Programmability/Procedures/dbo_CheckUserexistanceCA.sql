SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE Procedure [dbo].[CheckUserexistanceCA]

@Emailid varchar(100)
As 
begin

if not exists (select *  from CAusers where Email=@Emailid)

begin
select 0;
end

else

begin
select 1;
end

END 


GO