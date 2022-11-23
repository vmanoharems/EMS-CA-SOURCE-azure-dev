SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[InsertCheckRunByUser]  -- exec InsertCheckRunByUser 70,1
(
@UserID int,
@BankID int
)
AS
BEGIN
declare @ReturnStatus varchar(10) = 'Denied';

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 if exists(select * from CheckRunStatus where BankID=@BankID and Status in ('Pending','Working'))
 begin
	if exists(select * from CheckRunStatus where UserID=@UserID and BankID=@BankID and Status in ('Pending','Working'))
		 begin
			 set @ReturnStatus = 'Access';
		 end	
		 else 
		 begin
			 set @ReturnStatus = 'Denied';
		 end	  
 end
 else
 begin
	insert into CheckRunStatus(Status,UserID,BankID) values ('Pending',@UserID,@BankID);
	set @ReturnStatus = 'Access';
 end


--select distinct case when b.Name is null then 'Admin' else b.Name end as Name,@ReturnStatus as ReturnStatus
--from CheckRunStatus as a
--left join CAUsers as b on 
--a.UserID=b.UserID
--where a.UserID=@UserID and a.BankID=@BankID;

select distinct case when b.Name is null then 'Admin' else b.Name end as Name,@ReturnStatus as ReturnStatus
from CheckRunStatus as a
left join CAUsers as b on 
a.UserID=b.UserID
where a.Status in ('Pending','Working')  and a.BankID=@BankID;


END
GO